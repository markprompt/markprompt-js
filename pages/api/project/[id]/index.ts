import type { NextApiRequest, NextApiResponse } from 'next';
import { Project, Team } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Project;

const allowedMethods = ['GET', 'PATCH', 'DELETE'];

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
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(project);
  } else if (req.method === 'PATCH') {
    const { data: project, error } = await supabase
      .from('projects')
      .update(req.body)
      .eq('id', projectId)
      .select('*')
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(project);
  } else if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(400).end();
}
