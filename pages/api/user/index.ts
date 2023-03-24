import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { DbUser } from '@/types/types';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | DbUser;

const allowedMethods = ['GET', 'POST', 'PATCH'];

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
    let { error } = await supabase
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
  }

  return res.status(200).json({ status: 'ok' });
}
