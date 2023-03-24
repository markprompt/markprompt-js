import type { NextApiRequest, NextApiResponse } from 'next';
import { Project, Team } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { getAvailableProjectSlug } from '../../slug/generate-project-slug';
import { generateKey } from '@/lib/utils';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Project[]
  | Project;

const allowedMethods = ['GET', 'POST'];

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

  const teamId = req.query.id as Team['id'];

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .match({ team_id: teamId });

    if (error) {
      console.error('api/team/[]/projects:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data || []);
  } else if (req.method === 'POST') {
    const { name, candidateSlug, githubRepo } = req.body;
    const slug = await getAvailableProjectSlug(supabase, teamId, candidateSlug);
    const public_api_key = generateKey();
    let { data, error } = await supabase
      .from('projects')
      .insert([
        {
          name,
          team_id: teamId,
          slug,
          github_repo: githubRepo,
          created_by: session.user.id,
          public_api_key,
        },
      ])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('api/team/[]/projects', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      console.error('api/team/[]/projects: no data');
      return res.status(400).json({ error: 'Unable to create project' });
    }

    return res.status(200).json(data);
  }

  return res.status(200).json({ status: 'ok' });
}
