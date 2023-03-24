import { Project } from '@/types/types';
import { Ratelimit } from '@upstash/ratelimit';
import { getRedisClient } from './redis';
import { pluralize } from './utils';

type RateLimitIdProjectIdType = { value: Project['id']; type: 'projectId' };
type RateLimitIdTokenType = { value: string; type: 'token' };
type RateLimitIdHostnameType = { value: string; type: 'hostname' };
type RateLimitIdIPType = { value: string; type: 'ip' };

type RateLimitIdType =
  | RateLimitIdProjectIdType
  | RateLimitIdTokenType
  | RateLimitIdHostnameType
  | RateLimitIdIPType;

const rateLimitTypeToKey = (identifier: RateLimitIdType) => {
  return `${identifier.type}:${identifier.value}`;
};

export const checkEmbeddingsRateLimits = async (
  identifier: RateLimitIdType,
) => {
  // For now, impose a hard limit of 100 embeddings per minute
  // per project. Later, make this configurable.
  const ratelimit = new Ratelimit({
    redis: getRedisClient(),
    limiter: Ratelimit.fixedWindow(100, '1 m'),
    analytics: true,
  });

  const result = await ratelimit.limit(rateLimitTypeToKey(identifier));

  // Calcualte the remaining time until generations are reset
  const diff = Math.abs(
    new Date(result.reset).getTime() - new Date().getTime(),
  );
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

  return { result, hours, minutes };
};

export const checkCompletionsRateLimits = async (
  identifier: RateLimitIdType,
) => {
  // For now, impose a hard limit of 10 completions per minute
  // per hostname. Later, tie it to the plan associated to a team/project.
  const ratelimit = new Ratelimit({
    redis: getRedisClient(),
    limiter: Ratelimit.fixedWindow(10, '60 s'),
    analytics: true,
  });

  const result = await ratelimit.limit(rateLimitTypeToKey(identifier));

  // Calcualte the remaining time until generations are reset
  const diff = Math.abs(
    new Date(result.reset).getTime() - new Date().getTime(),
  );
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor(diff / 1000 / 60) - hours * 60;

  return { result, hours, minutes };
};

export const getEmbeddingsRateLimitResponse = (
  hours: number,
  minutes: number,
) => {
  return `You have reached your training limit for the day. You can resume training in ${pluralize(
    hours,
    'hour',
    'hours',
  )} and ${pluralize(minutes, 'minute', 'minutes')}. Email ${
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'us'
  } if you have any questions.`;
};
