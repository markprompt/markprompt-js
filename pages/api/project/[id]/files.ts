import type { NextApiRequest, NextApiResponse } from 'next';
import { DbFile, Project, ProjectChecksums } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { serverGetChecksums, serverSetChecksums } from './checksums';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | DbFile[];

const allowedMethods = ['GET', 'DELETE'];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
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

  if (req.method === 'GET') {
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!files) {
      return res.status(404).json({ error: 'No files found' });
    }

    return res.status(200).json(files);
  } else if (req.method === 'DELETE') {
    let deletedPaths: string[] = [];
    if (req.body) {
      const ids = req.body;
      const dbRes = await supabase
        .from('files')
        .delete()
        .in('id', ids)
        .select('path');
      if (dbRes.error) {
        return res.status(400).json({ error: dbRes.error.message });
      }
      deletedPaths = dbRes.data.map((d) => d.path);
    } else {
      const dbRes = await supabase
        .from('files')
        .delete()
        .eq('project_id', projectId)
        .select('path');
      if (dbRes.error) {
        return res.status(400).json({ error: dbRes.error.message });
      }
      deletedPaths = dbRes.data.map((d) => d.path);
    }

    // Delete associated checksums
    const oldChecksums = await serverGetChecksums(projectId);
    const newChecksums: ProjectChecksums = {};
    for (const key of Object.keys(oldChecksums)) {
      if (!deletedPaths.includes(key)) {
        newChecksums[key] = oldChecksums[key];
      }
    }
    await serverSetChecksums(projectId, newChecksums);

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(400).end();
}
