import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export const noTokenResponse = new NextResponse(
  JSON.stringify({
    success: false,
    message:
      'An authorization token needs to be provided. Head over to the Markprompt dashboard and get one under the project settings.',
  }),
  { status: 401, headers: { 'content-type': 'application/json' } },
);

export const noProjectForTokenResponse = new NextResponse(
  JSON.stringify({
    success: false,
    message:
      'No project was found matching the provided token. Head over to the Markprompt dashboard and get a valid token under the project settings.',
  }),
  { status: 401, headers: { 'content-type': 'application/json' } },
);

export const getProjectIdFromToken = async (
  req: NextRequest,
  res: NextResponse,
  token: string,
) => {
  const supabase = createMiddlewareSupabaseClient({ req, res });

  const { data } = await supabase
    .from('tokens')
    .select('project_id')
    .eq('value', token)
    .maybeSingle();

  return data?.project_id;
};
