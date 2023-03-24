import type { NextApiRequest, NextApiResponse } from 'next';
import { Project, ProjectChecksums, FileData } from '@/types/types';
import { generateFileEmbeddings } from '@/lib/generate-embeddings';
import { getProjectChecksumsKey, safeGetObject } from '@/lib/redis';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { createHash } from 'crypto';
import {
  checkEmbeddingsRateLimits,
  getEmbeddingsRateLimitResponse,
} from '@/lib/rate-limits';

type Data = {
  status?: string;
  error?: string;
  errors?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const file = req.body.file as FileData;
  const projectId = req.body.projectId as Project['id'];

  if (!req.body.forceRetrain && projectId) {
    const checksums = await safeGetObject<ProjectChecksums>(
      getProjectChecksumsKey(projectId),
      {},
    );
    const previousChecksum = checksums[file.path];
    const currentChecksum = createHash('sha256')
      .update(file.content)
      .digest('base64');
    if (previousChecksum === currentChecksum) {
      return res.status(200).json({ status: 'Already processed' });
    }
  }

  // Apply rate limits
  const rateLimitResult = await checkEmbeddingsRateLimits({
    type: 'projectId',
    value: projectId,
  });

  res.setHeader('X-RateLimit-Limit', rateLimitResult.result.limit);
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.result.remaining);

  if (!rateLimitResult.result.success) {
    console.error('[TRAIN] [RATE-LIMIT]');
    return res.status(429).json({
      status: getEmbeddingsRateLimitResponse(
        rateLimitResult.hours,
        rateLimitResult.minutes,
      ),
    });
  }

  const errors = await generateFileEmbeddings(supabase, projectId, file);

  return res.status(200).json({ status: 'ok', errors });
}
