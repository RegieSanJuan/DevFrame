import { appEnv, isRateLimitRedisConfigured } from "@/lib/env";

type RateLimitMode = "redis" | "memory";

type RateLimitConfig = {
  key: string;
  limit: number;
  windowSeconds: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  mode: RateLimitMode;
  remaining: number;
  resetSeconds: number;
  retryAfterSeconds: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

type RedisPipelineResult = Array<{
  result?: number;
  error?: string;
}>;

const globalRateLimitState = globalThis as typeof globalThis & {
  __devframeRateLimitStore?: Map<string, MemoryBucket>;
  __devframeRateLimitFallbackWarningShown?: boolean;
};

function getMemoryStore() {
  if (!globalRateLimitState.__devframeRateLimitStore) {
    globalRateLimitState.__devframeRateLimitStore = new Map();
  }

  return globalRateLimitState.__devframeRateLimitStore;
}

function getRedisConfig() {
  if (!isRateLimitRedisConfigured) {
    return null;
  }

  return {
    token: appEnv.rateLimitRedisRestToken,
    url: appEnv.rateLimitRedisRestUrl.replace(/\/+$/, ""),
  };
}

function warnMemoryFallbackInProduction(reason: string) {
  if (
    process.env.NODE_ENV !== "production" ||
    globalRateLimitState.__devframeRateLimitFallbackWarningShown
  ) {
    return;
  }

  globalRateLimitState.__devframeRateLimitFallbackWarningShown = true;
  console.warn(
    `DevFrame rate limiting is using in-memory fallback in production (${reason}). ` +
      "This is development-only protection on serverless platforms; configure Upstash Redis or Vercel KV for durable limits.",
  );
}

function normalizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9:_./-]/g, "_")
    .slice(0, 180);
}

async function enforceRedisRateLimit(
  config: RateLimitConfig,
): Promise<RateLimitResult | null> {
  const redis = getRedisConfig();

  if (!redis) {
    return null;
  }

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const windowId = Math.floor(now / windowMs);
  const resetAt = (windowId + 1) * windowMs;
  const key = `devframe:rate-limit:${normalizeKey(config.key)}:${windowId}`;

  const response = await fetch(`${redis.url}/pipeline`, {
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, config.windowSeconds + 5],
    ]),
    headers: {
      Authorization: `Bearer ${redis.token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Redis rate limit failed with ${response.status}`);
  }

  const pipeline = (await response.json()) as RedisPipelineResult;
  const count = Number(pipeline[0]?.result ?? 0);
  const resetSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
  const remaining = Math.max(0, config.limit - count);

  return {
    allowed: count <= config.limit,
    limit: config.limit,
    mode: "redis",
    remaining,
    resetSeconds,
    retryAfterSeconds: resetSeconds,
  };
}

function enforceMemoryRateLimit(config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const windowId = Math.floor(now / windowMs);
  const resetAt = (windowId + 1) * windowMs;
  const key = `${normalizeKey(config.key)}:${windowId}`;
  const store = getMemoryStore();
  const current = store.get(key);
  const nextCount = (current?.count ?? 0) + 1;

  store.set(key, {
    count: nextCount,
    resetAt,
  });

  for (const [storeKey, bucket] of store) {
    if (bucket.resetAt < now) {
      store.delete(storeKey);
    }
  }

  const resetSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));

  return {
    allowed: nextCount <= config.limit,
    limit: config.limit,
    mode: "memory",
    remaining: Math.max(0, config.limit - nextCount),
    resetSeconds,
    retryAfterSeconds: resetSeconds,
  };
}

export async function enforceRateLimit(config: RateLimitConfig) {
  if (!isRateLimitRedisConfigured) {
    warnMemoryFallbackInProduction("Redis/KV env vars are missing");
    return enforceMemoryRateLimit(config);
  }

  try {
    const redisResult = await enforceRedisRateLimit(config);

    if (redisResult) {
      return redisResult;
    }
  } catch (error) {
    warnMemoryFallbackInProduction("Redis/KV request failed");
    console.warn("Redis rate limit unavailable; using in-memory fallback.", error);
  }

  return enforceMemoryRateLimit(config);
}

export function createRateLimitHeaders(result: RateLimitResult) {
  return {
    "RateLimit-Limit": String(result.limit),
    "RateLimit-Remaining": String(result.remaining),
    "RateLimit-Reset": String(result.resetSeconds),
    "Retry-After": String(result.retryAfterSeconds),
    "X-DevFrame-RateLimit-Mode": result.mode,
  };
}
