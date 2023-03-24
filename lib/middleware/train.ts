import { NextRequest, NextResponse } from 'next/server';
import { checkCompletionsRateLimits } from '../rate-limits';
import { getAuthorizationToken, getHost, removeSchema } from '../utils';
import {
  getProjectIdFromToken,
  noProjectForTokenResponse,
  noTokenResponse,
} from './common';

export default async function TrainMiddleware(req: NextRequest) {
  // Requests to api.markprompt.com/train come exclusively from external
  // sources. Indeed, in the Markprompt dashboard, the internal
  // route /api/openai/train-file is used, and it will be cauche
  // when comparing requester hosts. So only requests with a valid
  // authorization bearer token will be accepted here.

  if (!req.ip) {
    return new Response('Forbidden', { status: 403 });
  }

  const token = getAuthorizationToken(req.headers.get('Authorization'));

  if (!token) {
    return noTokenResponse;
  }

  // Apply rate limiting here already based on IP. After that, apply rate
  // limiting on requester token.
  const rateLimitIPResult = await checkCompletionsRateLimits({
    value: req.ip,
    type: 'ip',
  });

  if (!rateLimitIPResult.result.success) {
    console.error(`[TRAIN] [RATE-LIMIT] IP ${req.ip}`);
    return new Response('Too many requests', { status: 429 });
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

  return NextResponse.rewrite(
    new URL(`/api/openai/train/${projectId}`, req.url),
  );
}
