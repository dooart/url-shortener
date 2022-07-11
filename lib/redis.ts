import { Redis } from "@upstash/redis";
import { ShortenedLink } from "./types";

const redis = Redis.fromEnv();

export const checkIdExistence = async (id: string): Promise<boolean> => {
  try {
    return (await redis.exists(id)) === 1;
  } catch (e) {
    throw e;
  }
};

export const findLinkById = async (id: string): Promise<ShortenedLink> => {
  try {
    return (await redis.hgetall(id)) as unknown as ShortenedLink;
  } catch (e) {
    throw e;
  }
};

export const findLinkIdByUrl = async (url: string): Promise<string> => {
  try {
    return (await redis.get(url)) as string;
  } catch (e) {
    throw e;
  }
};

export const saveLink = async (link: ShortenedLink) => {
  try {
    const { id, ...linkData } = link;
    return await redis.hmset(link.id, { ...linkData });
  } catch (e) {
    throw e;
  }
};

export const saveReverseLink = async (url: string, id: string) => {
  try {
    return await redis.set(url, id);
  } catch (e) {
    throw e;
  }
};

export const logAccessToLink = async (id: string) => {
  try {
    const p = redis.pipeline();
    p.hincrby(id, "timesAccessed", 1);
    p.hset(id, { lastAccessedAt: Date.now() });
    await p.exec();
  } catch (e) {
    throw e;
  }
};
