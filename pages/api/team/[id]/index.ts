import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Database } from '@/types/supabase';
import { Team } from '@/types/types';


type Data =
  | {
      status?: string;
      error?: string;
    }
  | Team;

const allowedMethods = ['GET', 'PATCH', 'DELETE'];

const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

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
      console.error('GET team', error);
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
      console.error('PATCH team', error);
      return res.status(400).json({ error: error.message });
    }

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.status(200).json(team);
  } else if (req.method === 'DELETE') {
    // Deletes a team an associated memberships
    const { error: membershipsError } = await supabase
      .from('memberships')
      .delete()
      .eq('team_id', req.query.id);

    if (membershipsError) {
      console.error('DELETE memberships', membershipsError);
      return res.status(400).json({ error: membershipsError.message });
    }

    // We must use the admin database here, because RLS prevents a
    // user from deleting a team they are not a member of, but in the
    // previous steps, we just deleted their membership.
    const { error: teamError } = await supabaseAdmin
      .from('teams')
      .delete()
      .eq('id', req.query.id);

    if (teamError) {
      console.error('DELETE team', teamError);
      return res.status(400).json({ error: teamError.message });
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(400).end();
}
