import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { checkCompletionsRateLimits } from '../rate-limits';
import { getAuthorizationToken, getHost, removeSchema } from '../utils';
import {
  getProjectIdFromToken,
  noProjectForTokenResponse,
  noTokenResponse,
} from './common';

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
      console.error(`[TRAIN] [RATE-LIMIT] IP ${req.ip}`);
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
        `[TRAIN] [RATE-LIMIT] Origin ${requesterHost}, IP: ${req.ip}`,
      );
      return new Response('Too many requests', { status: 429 });
    }

    if (requesterHost === getHost()) {
      // Requests from the Markprompt dashboard explicitly specify
      // the project id in the path: /completions/[project]
      projectId = path.split('/').slice(-1)[0];
    } else {
      const res = NextResponse.next();
      const projectKey = req.nextUrl.searchParams.get('projectKey');
      const supabase = createMiddlewareSupabaseClient({ req, res });

      let { data } = await supabase
        .from('projects')
        .select('id')
        .match({ public_api_key: projectKey })
        .limit(1)
        .select()
        .maybeSingle();

      if (!data?.id) {
        return new Response('Project not found', { status: 404 });
      }

      projectId = data?.id;

      // Now that we have a project id, we need to check that the
      // the project has whitelisted the domain the request comes from.

      let { count } = await supabase
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
      console.error(`[TRAIN] [RATE-LIMIT] Token ${token}, IP: ${req.ip}`);
      return new Response('Too many requests', { status: 429 });
    }

    const res = NextResponse.next();
    const projectId = await getProjectIdFromToken(req, res, token);

    if (!projectId) {
      return noProjectForTokenResponse;
    }
  }

  return NextResponse.rewrite(
    new URL(`/api/openai/completions/${projectId}`, req.url),
  );
}
