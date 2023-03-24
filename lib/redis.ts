import { Project } from '@/types/types';
import { Redis } from '@upstash/redis';

let redis: Redis | undefined = undefined;

const monthBin = (date: Date) => {
  return `${date.getFullYear()}/${date.getMonth() + 1}`;
};

export const getProjectChecksumsKey = (projectId: Project['id']) => {
  return `${process.env.NODE_ENV}:project:${projectId}:checksums`;
};

export const getProjectEmbeddingsMonthTokenCountKey = (
  projectId: Project['id'],
  date: Date,
) => {
  return `${process.env.NODE_ENV}:project:${projectId}:token_count:${monthBin(
    date,
  )}`;
};

export const getRedisClient = () => {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_URL || '',
      token: process.env.UPSTASH_TOKEN || '',
    });
  }
  return redis;
};

export const safeGetObject = async <T>(
  key: string,
  defaultValue: T,
): Promise<T> => {
  const value = await get(key);
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      // Do nothing
    }
  }
  return defaultValue;
};

export const get = async (key: string): Promise<string | null> => {
  try {
    return getRedisClient().get<string>(key);
  } catch (e) {
    console.error('Redis `get` error', e);
  }
  return null;
};

export const set = async (key: string, value: string) => {
  try {
    await getRedisClient().set(key, value);
  } catch (e) {
    console.error('Redis `set` error', e, key, value);
  }
};

export const setWithExpiration = async (
  key: string,
  value: string,
  expirationInSeconds: number,
) => {
  try {
    await getRedisClient().set(key, value, { ex: expirationInSeconds });
  } catch (e) {
    console.error('Redis `set` error', e);
  }
};

export const hget = async (key: string, field: string): Promise<any> => {
  try {
    return getRedisClient().hget(key, field);
  } catch (e) {
    console.error('Redis `hget` error', e);
  }
  return undefined;
};

export const hset = async (key: string, object: any) => {
  try {
    await getRedisClient().hset(key, object);
  } catch (e) {
    console.error('Redis `hset` error', e);
  }
};

export const del = async (key: string) => {
  try {
    await getRedisClient().del(key);
  } catch (e) {
    console.error('Redis `del` error', e);
  }
};

export const batchGet = async (keys: string[]) => {
  try {
    const pipeline = getRedisClient().pipeline();
    for (const key of keys) {
      pipeline.get(key);
    }
    return pipeline.exec();
  } catch (e) {
    console.error('Redis `batchGet` error', e);
  }
};

export const batchDel = async (keys: string[]) => {
  try {
    const pipeline = getRedisClient().pipeline();
    for (const key of keys) {
      pipeline.del(key);
    }
    await pipeline.exec();
  } catch (e) {
    console.error('Redis `batchDel` error', e);
  }
};
