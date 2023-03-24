import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjectChecksumsKey, safeGetObject, set } from '@/lib/redis';
import { Project, ProjectChecksums } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Data = {
  checksums?: ProjectChecksums;
  status?: string;
  error?: string;
};

export const serverSetChecksums = async (
  projectId: Project['id'],
  checksums: ProjectChecksums,
) => {
  await set(
    getProjectChecksumsKey(projectId),
    // TODO: For some reason, Upstash seems to treat a single
    // JSON.stringified object as an object, and not as a raw string.
    // Fetching the string subsequently and running JSON.parse will
    // then fail. By applying JSON.stringify twice, it is fixed.
    // Seems wrong, should investigate.
    JSON.stringify(JSON.stringify(checksums)),
  );
};

export const serverGetChecksums = async (
  projectId: Project['id'],
): Promise<ProjectChecksums> => {
  return safeGetObject(getProjectChecksumsKey(projectId), {});
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.method || !['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const supabase = createServerSupabaseClient<Database>({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const projectId = req.query.id as Project['id'];

  if (req.method === 'POST') {
    if (!req.body?.checksums) {
      console.error('[Checksums] Missing checksums');
      return res.status(400).json({ error: 'Missing checksums.' });
    }
    await serverSetChecksums(projectId, req.body.checksums);
    return res.status(200).json({ status: 'ok' });
  } else if (req.method === 'GET') {
    try {
      const checksums = await serverGetChecksums(projectId);
      console.error('[Checksums] All good');
      return res.status(200).json({ checksums });
    } catch (e) {
      return res.status(400).json({ error: `${e}` });
    }
  }

  return res.status(200).json({ status: 'ok' });
}
