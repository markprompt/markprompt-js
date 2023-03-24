import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import slugify from '@sindresorhus/slugify';
import { generateKey, generateRandomSlug, slugFromEmail } from '@/lib/utils';
import { getAvailableTeamSlug } from '../slug/generate-team-slug';
import { Project, Team } from '@/types/types';

type Data =
  | {
      status?: string;
      error?: string;
    }
  | { team: Team; project: Project };

const allowedMethods = ['POST'];

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

  // Check if personal team already exists
  let { data: team } = await supabase
    .from('teams')
    .select('id')
    .match({ created_by: session.user.id, is_personal: true })
    .limit(1)
    .select()
    .maybeSingle();

  if (!team) {
    let candidateSlug = '';
    if (session.user.user_metadata?.user_name) {
      candidateSlug = slugify(session.user.user_metadata?.user_name);
    } else if (session.user.user_metadata?.name) {
      candidateSlug = slugify(session.user.user_metadata?.name);
    } else if (session.user.email) {
      candidateSlug = slugFromEmail(session.user.email);
    } else {
      candidateSlug = generateRandomSlug();
    }

    const slug = await getAvailableTeamSlug(supabase, candidateSlug);
    let { data, error } = await supabase
      .from('teams')
      .insert([
        {
          name: 'Personal',
          is_personal: true,
          slug,
          created_by: session.user.id,
        },
      ])
      .select('*')
      .limit(1)
      .maybeSingle();
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    team = data;
  }

  if (!team) {
    return res.status(400).json({ error: 'Unable to create team' });
  }

  // Check if membership already exists
  const { count: membershipCount } = await supabase
    .from('memberships')
    .select('id', { count: 'exact' })
    .match({ user_id: session.user.id, team_id: team.id, type: 'admin' });

  if (membershipCount === 0) {
    // Automatically add the creator of the team as an admin member.
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert([{ user_id: session.user.id, team_id: team.id, type: 'admin' }]);

    if (membershipError) {
      return res.status(400).json({ error: membershipError.message });
    }
  }

  // Check if starter project already exists
  let { data: project } = await supabase
    .from('projects')
    .select('id')
    .match({ team_id: team.id, is_starter: true })
    .limit(1)
    .select()
    .maybeSingle();

  if (!project) {
    // Create a starter project
    const public_api_key = generateKey();
    const { data, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          name: 'Starter',
          slug: 'starter',
          is_starter: true,
          created_by: session.user.id,
          team_id: team.id,
          public_api_key,
        },
      ])
      .select('*')
      .limit(1)
      .maybeSingle();

    if (projectError) {
      return res.status(400).json({ error: projectError.message });
    }

    project = data;
  }

  if (!project) {
    return res.status(400).json({ error: 'Unable to create starter project' });
  }

  // Check if token already exists
  let { count: tokenCount } = await supabase
    .from('tokens')
    .select('id', { count: 'exact' })
    .match({ project_id: project.id });

  if (tokenCount === 0) {
    const value = generateKey();
    await supabase.from('tokens').insert([
      {
        value,
        project_id: project.id,
        created_by: session.user.id,
      },
    ]);
  }

  return res.status(200).json({ team, project });
}
