import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs, { promises as promisesFs } from 'fs';
import unzip from 'unzipper';
import { generateFileEmbeddings } from '@/lib/generate-embeddings';
import { ProjectChecksums, FileData, Project } from '@/types/types';
import { getProjectChecksumsKey, safeGetObject, set } from '@/lib/redis';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { createHash } from 'crypto';
import {
  checkEmbeddingsRateLimits,
  getEmbeddingsRateLimitResponse,
} from '@/lib/rate-limits';
import { pluralize } from '@/lib/utils';

type Data = {
  status?: string;
  error?: string;
};

const MAX_FILE_SIZE = 9_000_000;
const ACCEPTED_MIME_TYPES = ['text/plain', 'application/octet-stream'];

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const data: any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  const file = data?.files?.file;

  if (!file) {
    return res.status(400).json({ error: 'Missing file.' });
  }

  if (file.size > MAX_FILE_SIZE) {
    return res.status(413).json({ error: 'Payload too large.' });
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
    return res.status(415).json({
      error: 'Unsupported file type. Only text and zip files are supported.',
    });
  }

  const filesWithPath: FileData[] = [];

  const path = file?.filepath;

  if (file.mimetype === 'application/octet-stream') {
    await new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(unzip.Parse())
        .on('entry', async (entry) => {
          if (
            entry.type !== 'File' ||
            entry.path.startsWith('.') ||
            entry.path.includes('/.')
          ) {
            // Ignore dotfiles, e.g. '.DS_Store'
            return;
          }
          const content = await entry.buffer();
          filesWithPath.push({
            path: entry.path,
            name: entry.path.split('/').slice(-1)[0],
            content: content.toString(),
          });
          entry.autodrain();
        })
        .on('error', reject)
        .on('finish', resolve);
    });
  } else {
    const content = await promisesFs.readFile(path, { encoding: 'utf8' });
    filesWithPath.push({
      path: file.originalFilename,
      name: file.originalFilename,
      content,
    });
  }

  let updatedChecksums: ProjectChecksums = {};
  const checksums: ProjectChecksums = await safeGetObject(
    getProjectChecksumsKey(projectId),
    {},
  );

  let numFilesSuccess = 0;
  let allFileErrors: { path: string; message: string }[] = [];
  for (const file of filesWithPath) {
    // Check the checksum, and skip if equals
    const contentChecksum = createHash('sha256')
      .update(file.content)
      .digest('base64');

    if (checksums[file.path] === contentChecksum) {
      updatedChecksums[file.path] = contentChecksum;
      numFilesSuccess++;
      continue;
    }

    const supabase = createServerSupabaseClient<Database>({ req, res });

    const errors = await generateFileEmbeddings(supabase, projectId, file);
    updatedChecksums[file.path] = contentChecksum;
    if (!errors) {
      numFilesSuccess++;
    } else {
      allFileErrors = [...allFileErrors, ...errors];
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
