import type { NextApiRequest, NextApiResponse } from 'next';
import { Team } from '@/types/types';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { getAvailableTeamSlug } from '../slug/generate-team-slug';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | Team[]
  | Team;

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

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('memberships')
      .select('user_id, teams (*)')
      .match({ user_id: session.user.id });

    if (error) {
      console.error('Error', error.message);
      return res.status(400).json({ error: error.message });
    }

    const teams = (data?.map((d) => d.teams) || []) as Team[];
    return res.status(200).json(teams);
  } else if (req.method === 'POST') {
    const { candidateSlug, isPersonal, ...rest } = req.body;
    const slug = await getAvailableTeamSlug(supabase, candidateSlug);
    let { data, error } = await supabase
      .from('teams')
      .insert([
        { ...rest, is_personal: isPersonal, slug, created_by: session.user.id },
      ])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(400).json({ error: 'Unable to create team' });
    }

    // Automatically add the creator of the team as an admin member.
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert([{ user_id: session.user.id, team_id: data.id, type: 'admin' }]);

    if (membershipError) {
      return res.status(400).json({ error: membershipError.message });
    }

    return res.status(200).json(data);
  }

  return res.status(200).json({ status: 'ok' });
}
