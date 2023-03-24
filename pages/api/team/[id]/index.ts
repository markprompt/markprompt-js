import type { NextApiRequest, NextApiResponse } from 'next';
import { Team } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Team;

const allowedMethods = ['GET', 'PATCH'];

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

  if (req.method === 'GET') {
    const { data: team, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', req.query.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('api/team/[]', error);
      return res.status(400).json({ error: error.message });
    }

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(team);
  } else if (req.method === 'PATCH') {
    const { data: team, error } = await supabase
      .from('teams')
      .update(req.body)
      .eq('id', req.query.id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('api/team/[]', error);
      return res.status(400).json({ error: error.message });
    }

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(team);
  }

  return res.status(400).end();
}
