import type { NextApiRequest, NextApiResponse } from 'next';
import { Domain, Project } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Domain[]
  | Domain;

const allowedMethods = ['GET', 'POST', 'DELETE'];

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
    const { data: domains, error } = await supabase
      .from('domains')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!domains) {
      return res.status(404).json({ error: 'No domains found.' });
    }

    return res.status(200).json(domains);
  } else if (req.method === 'POST') {
    if (!req.body.name) {
      return res.status(400).json({ error: 'No domain provided.' });
    }

    let { error, data } = await supabase
      .from('domains')
      .insert([{ project_id: projectId, name: req.body.name as string }])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return res.status(400).json({ error: 'Error adding domain.' });
    }
    return res.status(200).json(data);
  } else if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', req.body.id);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).end();
  }

  return res.status(400).end();
}
