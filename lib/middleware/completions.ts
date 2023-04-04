import { Database } from '@/types/supabase';
import { Project } from '@/types/types';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { checkCompletionsRateLimits } from '../rate-limits';
import {
  getAuthorizationToken,
  isSKTestKey,
  removeSchema,
  truncateMiddle,
} from '../utils';
import {
  getProjectIdFromToken,
  noProjectForTokenResponse,
  noTokenOrProjectKeyResponse,
  noTokenResponse,
} from './common';

// Admin access to Supabase, bypassing RLS.
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

export default async function CompletionsMiddleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    // Check that IP is present and not rate limited
    if (!req.ip) {
      return new Response('Forbidden', { status: 403 });
    }

    const rateLimitIPResult = await checkCompletionsRateLimits({
      value: req.ip,
      type: 'ip',
    });

    if (!rateLimitIPResult.result.success) {
      console.error(
        `[COMPLETIONS] [RATE-LIMIT] IP ${req.ip}, origin: ${req.headers.get(
          'origin',
        )}`,
      );
      return new Response('Too many requests', { status: 429 });
    }
  }

  const requesterOrigin = req.headers.get('origin');
  const requesterHost = requesterOrigin && removeSchema(requesterOrigin);

  if (requesterHost) {
    // Browser requests. Check that origin is not rate-limited.

    const rateLimitHostnameResult = await checkCompletionsRateLimits({
      value: requesterHost,
      type: 'hostname',
    });

    if (!rateLimitHostnameResult.result.success) {
      console.error(
        `[COMPLETIONS] [RATE-LIMIT] IP: ${req.ip}, origin: ${requesterOrigin}`,
      );
      return new Response('Too many requests', { status: 429 });
    }
  }

  const body = await req.json();

  const token = getAuthorizationToken(req.headers.get('Authorization'));
  // In v0, we support projectKey query parameters
  const projectKey =
    body.projectKey || req.nextUrl.searchParams.get('projectKey');

  if (!token && !projectKey) {
    return noTokenOrProjectKeyResponse;
  }

  let projectId: Project['id'] | undefined = undefined;

  if (token) {
    // If authorization token is present, use this to find the project id
    const rateLimitResult = await checkCompletionsRateLimits({
      value: token,
      type: 'token',
    });

    if (!rateLimitResult.result.success) {
      console.error(
        `[COMPLETIONS] [RATE-LIMIT] IP: ${req.ip}, token: ${truncateMiddle(
          token,
          2,
          2,
        )}`,
      );
      return new Response('Too many requests', { status: 429 });
    }

    const res = NextResponse.next();
    projectId = await getProjectIdFromToken(req, res, supabaseAdmin, token);

    if (!projectId) {
      return noProjectForTokenResponse;
    }
  }

  if (projectKey) {
    const _isSKTestKey = isSKTestKey(projectKey);

    // Admin supabase needed here, as the projects table is subject to RLS
    let { data } = await supabaseAdmin
      .from('projects')
      .select('id')
      .match(
        _isSKTestKey
          ? { private_dev_api_key: projectKey }
          : { public_api_key: projectKey },
      )
      .limit(1)
      .select()
      .maybeSingle();

    if (!data?.id) {
      console.error('Project not found', truncateMiddle(projectKey || ''));
      return new Response(
        `No project with projectKey ${truncateMiddle(
          projectKey,
        )} was found. Please provide a valid project key. You can obtain your project key in the Markprompt dashboard, under project settings.`,
        { status: 404 },
      );
    }

    projectId = data.id;

    // Now that we have a project id, we need to check that the
    // the project has whitelisted the domain the request comes from.
    // Admin supabase needed here, as the projects table is subject to RLS.
    // We bypass this check if the key is a test key.
    if (!_isSKTestKey) {
      let { count } = await supabaseAdmin
        .from('domains')
        .select('id', { count: 'exact' })
        .match({ project_id: projectId, name: requesterHost });

      if (count === 0) {
        return new Response(
          `The domain ${requesterHost} is not allowed to access completions for the project with key ${truncateMiddle(
            projectKey,
          )}. If you need to access completions from a non-whitelisted domain, such as localhost, use a test project key instead.`,
          { status: 401 },
        );
      }
    }
  }

  if (!projectId) {
    return new Response(
      'No project found matching the provided key or authorization token.',
      { status: 401 },
    );
  }

  return NextResponse.rewrite(
    new URL(`/api/v1/openai/completions/${projectId}`, req.url),
  );
}
