import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { SupabaseClient } from '@supabase/auth-helpers-react';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | string;

const allowedMethods = ['POST'];

const RESERVED_SLUGS = ['settings', 'legal', 'docs'];

export const isTeamSlugAvailable = async (
  supabase: SupabaseClient,
  slug: string,
) => {
  if (RESERVED_SLUGS.includes(slug)) {
    return false;
  }
  let { count } = await supabase
    .from('teams')
    .select('slug', { count: 'exact' })
    .eq('slug', slug);
  return count === 0;
};

export const getAvailableTeamSlug = async (
  supabase: SupabaseClient,
  baseSlug: string,
) => {
  let candidateSlug = baseSlug;
  let attempt = 0;
  while (true) {
    const isAvailable = await isTeamSlugAvailable(supabase, candidateSlug);
    if (isAvailable) {
      return candidateSlug;
    }
    attempt++;
    candidateSlug = `${baseSlug}-${attempt}`;
  }
};

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

  const candidate = req.body.candidate;
  const slug = await getAvailableTeamSlug(supabase, candidate);

  return res.status(200).json(slug);
}
