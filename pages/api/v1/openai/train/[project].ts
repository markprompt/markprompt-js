import { createClient } from '@supabase/supabase-js';
import JSZip from 'jszip';
import type { NextApiRequest, NextApiResponse } from 'next';
import pLimit from 'p-limit';
import { isPresent } from 'ts-is-present';

import { generateFileEmbeddings } from '@/lib/generate-embeddings';
import {
  checkEmbeddingsRateLimits,
  getEmbeddingsRateLimitResponse,
} from '@/lib/rate-limits';
import { getProjectChecksumsKey, safeGetObject, set } from '@/lib/redis';
import { getBYOOpenAIKey } from '@/lib/supabase';
import {
  createChecksum,
  getNameFromPath,
  pluralize,
  shouldIncludeFileWithPath,
} from '@/lib/utils';
import { getMarkpromptConfigOrDefault } from '@/lib/utils.browser';
import { getBufferFromReadable } from '@/lib/utils.node';
import { Database } from '@/types/supabase';
import { FileData, Project, ProjectChecksums } from '@/types/types';

type Data = {
  status?: string;
  error?: string;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const ACCEPTED_CONTENT_TYPES = [
  'application/json',
  'application/octet-stream',
  'application/zip',
];

// Admin access to Supabase, bypassing RLS.
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

const allowedMethods = ['POST'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const projectId = req.query.project as Project['id'];

  if (!projectId) {
    return res.status(401).json({ error: 'Invalid project id' });
  }

  // Apply rate limits before hitting the database
  const rateLimitResult = await checkEmbeddingsRateLimits({
    type: 'projectId',
    value: projectId,
  });

  res.setHeader('X-RateLimit-Limit', rateLimitResult.result.limit);
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.result.remaining);

  if (!rateLimitResult.result.success) {
    return res.status(429).json({
      status: getEmbeddingsRateLimitResponse(
        rateLimitResult.hours,
        rateLimitResult.minutes,
      ),
    });
  }

  let filesWithPath: FileData[] = [];

  const buffer = await getBufferFromReadable(req);
  const contentType = req.headers['content-type'];

  if (!contentType || !ACCEPTED_CONTENT_TYPES.includes(contentType)) {
    return res.status(400).json({
      status: `Please specify a content type. Currently supported values are: ${ACCEPTED_CONTENT_TYPES.join(
        ', ',
      )}.`,
    });
  }

  const { data } = await supabaseAdmin
    .from('projects')
    .select('markprompt_config')
    .eq('id', projectId)
    .limit(1)
    .maybeSingle();

  const config = getMarkpromptConfigOrDefault(data?.markprompt_config);

  if (
    contentType === 'application/zip' ||
    contentType === 'application/octet-stream'
  ) {
    // A zip file is uploaded
    try {
      const zip = await JSZip.loadAsync(buffer);
      filesWithPath = (
        await Promise.all(
          Object.keys(zip.files).map(async (k) => {
            if (
              !shouldIncludeFileWithPath(
                k,
                config.include || [],
                config.exclude || [],
              )
            ) {
              return undefined;
            }
            try {
              const content = await zip.files[k].async('string');
              const path = k.startsWith('/') ? k : '/' + k;
              return { path, name: getNameFromPath(k), content };
            } catch (e) {
              console.error('Error extracting file:', e);
              return undefined;
            }
          }),
        )
      ).filter(isPresent);
    } catch (e) {
      console.error('Error loading zip:', e);
      return res.status(400).json({ status: `Invalid data: ${e}` });
    }
  } else if (contentType === 'application/json') {
    // Try if this is a raw JSON payload
    try {
      const rawBody = buffer.toString('utf8');
      const body = JSON.parse(rawBody);
      if (body?.files && Array.isArray(body.files)) {
        // v1
        filesWithPath = body.files
          .map((f: unknown) => {
            if (f === null || typeof f !== 'object') return undefined;
            if (!('id' in f) || !('content' in f)) return undefined;

            if (typeof f.id !== 'string' || typeof f.content !== 'string') {
              return undefined;
            }

            if (
              !shouldIncludeFileWithPath(
                f.id,
                config.include || [],
                config.exclude || [],
              )
            ) {
              return undefined;
            }

            return {
              path: f.id,
              name: getNameFromPath(f.id),
              content: f.content,
            };
          })
          .filter(isPresent);
      } else {
        // v0
        filesWithPath = Object.keys(body)
          .map((path) => {
            if (
              !shouldIncludeFileWithPath(
                path,
                config.include || [],
                config.exclude || [],
              )
            ) {
              return undefined;
            }
            return {
              path,
              name: getNameFromPath(path),
              content: body[path],
            };
          })
          .filter(isPresent);
      }
    } catch (e) {
      console.error('Error extracting payload', e);
      return res.status(400).json({ status: `Invalid data: ${e}` });
    }
  }

  const updatedChecksums: ProjectChecksums = {};
  const checksums: ProjectChecksums = await safeGetObject(
    getProjectChecksumsKey(projectId),
    {},
  );

  const byoOpenAIKey = await getBYOOpenAIKey(supabaseAdmin, projectId);

  let numFilesSuccess = 0;
  let allFileErrors: { path: string; message: string }[] = [];

  const forceRetrain = req.headers['x-markprompt-force-retrain'] === 'true';

  const processFile = async (file: FileData) => {
    // Check the checksum, and skip if equals
    const contentChecksum = createChecksum(file.content);

    if (!forceRetrain && checksums[file.path] === contentChecksum) {
      updatedChecksums[file.path] = contentChecksum;
      numFilesSuccess++;
      return;
    }

    const errors = await generateFileEmbeddings(
      supabaseAdmin,
      projectId,
      file,
      byoOpenAIKey,
    );

    updatedChecksums[file.path] = contentChecksum;
    if (errors && errors.length > 0) {
      allFileErrors = [...allFileErrors, ...errors];
    } else {
      numFilesSuccess++;
    }
  };

  // TODO: check how much we can do concurrently without hitting
  // rate limitations.
  const limit = pLimit(5);

  await Promise.all(
    filesWithPath.map((fileWithPath) => {
      return limit(() => processFile(fileWithPath));
    }),
  );

  await set(
    getProjectChecksumsKey(projectId),
    JSON.stringify(JSON.stringify(updatedChecksums)),
  );

  let message;
  const successMessage = `Successfully trained ${pluralize(
    numFilesSuccess,
    'file',
    'files',
  )}.`;

  if (allFileErrors.length > 0) {
    if (numFilesSuccess > 0) {
      message = successMessage;
    }
    message += `\nEncountered ${pluralize(
      allFileErrors.length,
      'error',
      'errors',
    )}:\n${allFileErrors
      .map((e) => `* In '${e.path}': ${e.message}`)
      .join('\n')}`;
  } else {
    message = successMessage;
  }

  res.status(200).json({
    status: message,
  });
}
