import type { NextApiRequest, NextApiResponse } from 'next';
import { generateFileEmbeddings } from '@/lib/generate-embeddings';
import { ProjectChecksums, FileData, Project } from '@/types/types';
import { getProjectChecksumsKey, safeGetObject, set } from '@/lib/redis';
import { Database } from '@/types/supabase';
import {
  checkEmbeddingsRateLimits,
  getEmbeddingsRateLimitResponse,
} from '@/lib/rate-limits';
import { createChecksum, getNameFromPath, pluralize } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import { getBYOOpenAIKey } from '@/lib/supabase';

type Data = {
  status?: string;
  error?: string;
};

const MAX_FILE_SIZE = 9_000_000;
const ACCEPTED_MIME_TYPES = ['text/plain', 'application/octet-stream'];

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

  const filesWithPath: FileData[] = Object.keys(req.body).map((path) => {
    return {
      path,
      name: getNameFromPath(path),
      content: req.body[path],
    };
  });

  let updatedChecksums: ProjectChecksums = {};
  const checksums: ProjectChecksums = await safeGetObject(
    getProjectChecksumsKey(projectId),
    {},
  );

  const byoOpenAIKey = await getBYOOpenAIKey(supabaseAdmin, projectId);

  let numFilesSuccess = 0;
  let allFileErrors: { path: string; message: string }[] = [];

  for (const file of filesWithPath) {
    // Check the checksum, and skip if equals
    const contentChecksum = createChecksum(file.content);

    if (checksums[file.path] === contentChecksum) {
      updatedChecksums[file.path] = contentChecksum;
      numFilesSuccess++;
      continue;
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
  }

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
