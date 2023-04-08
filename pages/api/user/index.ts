import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Database } from '@/types/supabase';
import { DbUser } from '@/types/types';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | DbUser;

const allowedMethods = ['GET', 'POST', 'PATCH', 'DELETE'];

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
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error GET:', error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      console.error('Error: user not found');
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(data);
  } else if (req.method === 'PATCH') {
    const { error } = await supabase
      .from('users')
      .update({
        ...req.body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error PATCH:', error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ status: 'ok' });
  } else if (req.method === 'DELETE') {
    // Firt, delete all memberships, with the service role key
    const { data, error: membershipError } = await supabaseAdmin
      .from('memberships')
      .delete()
      .eq('user_id', session.user.id)
      .select('team_id');

    if (membershipError) {
      console.error('Error DELETE memberships:', membershipError.message);
      return res.status(400).json({ error: membershipError.message });
    }

    // TODO: right now, teams can only hold a single user. So here,
    // when deleting a user, we also delete all associated teams.
    // We need to do it with the service role key since at this
    // point, the user is no longer a member of the team, the
    // membership having been deleted above.
    const teamIds = (data || []).map((d) => d.team_id);
    const { error: teamsError } = await supabaseAdmin
      .from('teams')
      .delete()
      .in('id', teamIds);

    if (teamsError) {
      console.error('Error DELETE teams:', teamsError.message);
      return res.status(400).json({ error: teamsError.message });
    }

    const { error: userError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', session.user.id);

    if (userError) {
      console.error('Error DELETE user:', userError.message);
      return res.status(400).json({ error: userError.message });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      session.user.id,
    );

    if (authError) {
      console.error('Error DELETE auth:', authError.message);
      return res.status(400).json({ error: authError.message });
    }

    return res.status(200).json({ status: 'ok' });
  }

  return res.status(200).json({ status: 'ok' });
}
