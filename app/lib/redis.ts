import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

function createRedisClient() {
  if (!REDIS_HOST || !REDIS_PORT  || !REDIS_PASSWORD) {
    throw new Error("Redis is not configured. Set REDIS_HOST, REDIS_PORT, REDIS_PASSWORD.");
  }

  return new Redis({
    host: REDIS_HOST,
    port: Number.parseInt(REDIS_PORT, 10),
    username: "default",
    password: REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
}

const globalForRedis = globalThis as unknown as {
  redis?: Redis;
};

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

export function createRedisSubscriber() {
  return redis.duplicate();
}
