import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { checkCompletionsRateLimits } from '../rate-limits';
import { getAuthorizationToken, truncateMiddle } from '../utils';
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

export default async function TrainMiddleware(req: NextRequest) {
  // Requests to api.markprompt.com/v1/train come exclusively from external
  // sources. Indeed, in the Markprompt dashboard, the internal
  // route /api/v1/openai/train-file is used, and it will be cauche
  // when comparing requester hosts. So only requests with a valid
  // authorization bearer token will be accepted here.

  if (process.env.NODE_ENV === 'production' && !req.ip) {
    return new Response('Forbidden', { status: 403 });
  }

  const token = getAuthorizationToken(req.headers.get('Authorization'));

  if (!token) {
    return noTokenResponse;
  }

  if (process.env.NODE_ENV === 'production' && req.ip) {
    // Apply rate limiting here already based on IP. After that, apply rate
    // limiting on requester token.
    const rateLimitIPResult = await checkCompletionsRateLimits({
      value: req.ip,
      type: 'ip',
    });

    if (!rateLimitIPResult.result.success) {
      console.error(
        `[TRAIN] [RATE-LIMIT] IP ${req.ip}, token: ${truncateMiddle(
          token,
          2,
          2,
        )}`,
      );
      return new Response('Too many requests', { status: 429 });
    }
  }
  // Apply rate-limit here already, before looking up the project id,
  // which requires a database lookup.
  const rateLimitResult = await checkCompletionsRateLimits({
    value: token,
    type: 'token',
  });

  if (!rateLimitResult.result.success) {
    console.error(
      `[TRAIN] [RATE-LIMIT] IP: ${req.ip}, token ${truncateMiddle(
        token,
        2,
        2,
      )}`,
    );
    return new Response('Too many requests', { status: 429 });
  }

  const res = NextResponse.next();

  const projectId = await getProjectIdFromToken(req, res, supabaseAdmin, token);

  if (!projectId) {
    return noProjectForTokenResponse;
  }

  return NextResponse.rewrite(
    new URL(`/api/v1/openai/train/${projectId}`, req.url),
  );
}
