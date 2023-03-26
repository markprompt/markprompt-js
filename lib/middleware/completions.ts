import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { checkCompletionsRateLimits } from '../rate-limits';
import {
  getAuthorizationToken,
  getHost,
  removeSchema,
  truncateMiddle,
} from '../utils';
import {
  getProjectIdFromToken,
  noProjectForTokenResponse,
  noTokenResponse,
} from './common';

// Admin access to Supabase, bypassing RLS.
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

export default async function CompletionsMiddleware(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    if (!req.ip) {
      return new Response('Forbidden', { status: 403 });
    }

    // Apply rate limiting here already based on IP. After that, apply rate
    // limiting on requester origin and token.

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

  const path = req.nextUrl.pathname;
  const requesterOrigin = req.headers.get('origin');

  let projectId;
  if (requesterOrigin) {
    const requesterHost = removeSchema(requesterOrigin);

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

    if (requesterHost === getHost()) {
      // Requests from the Markprompt dashboard explicitly specify
      // the project id in the path: /completions/[project]
      projectId = path.split('/').slice(-1)[0];
    } else {
      const projectKey = req.nextUrl.searchParams.get('projectKey');

      // Admin supabase needed here, as the projects table is subject to RLS
      let { data } = await supabaseAdmin
        .from('projects')
        .select('id')
        .match({ public_api_key: projectKey })
        .limit(1)
        .select()
        .maybeSingle();

      if (!data?.id) {
        console.error('Project not found', truncateMiddle(projectKey || ''));
        return new Response('Project not found', { status: 404 });
      }

      projectId = data?.id;

      // Now that we have a project id, we need to check that the
      // the project has whitelisted the domain the request comes from.
      // Admin supabase needed here, as the projects table is subject to RLS
      let { count } = await supabaseAdmin
        .from('domains')
        .select('id', { count: 'exact' })
        .eq('project_id', projectId);

      if (count === 0) {
        return new Response(
          'This domain is not allowed to access completions for this project',
          { status: 401 },
        );
      }
    }
  } else {
    // Non-browser requests expect an authorization token.
    const token = getAuthorizationToken(req.headers.get('Authorization'));
    if (!token) {
      return noTokenResponse;
    }

    // Apply rate-limit here already, before looking up the project id,
    // which requires a database lookup.
    const rateLimitResult = await checkCompletionsRateLimits({
      value: token,
      type: 'token',
    });

    if (!rateLimitResult.result.success) {
      console.error(
        `[COMPLETIONS] [RATE-LIMIT] IP: ${
          req.ip
        }, token ${token}, token: ${truncateMiddle(token, 2, 2)}`,
      );
      return new Response('Too many requests', { status: 429 });
    }

    const res = NextResponse.next();
    projectId = await getProjectIdFromToken(req, res, supabaseAdmin, token);

    if (!projectId) {
      return noProjectForTokenResponse;
    }
  }

  return NextResponse.rewrite(
    new URL(`/api/openai/completions/${projectId}`, req.url),
  );
}
