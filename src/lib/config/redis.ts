// utils
import RateLimiter from "async-ratelimiter"
import { Redis } from "ioredis"

// configs
import { env } from "@/lib/config/env.mjs"

// init redis url from env
const getRedisUrl = () => {
  if (env.REDIS_URL) {
    return env.REDIS_URL
  }

  throw new Error("REDIS_URL is not defined")
}

// set redis url
let redis = new Redis(getRedisUrl())

if (!redis) {
  redis = new Redis(env.REDIS_URL, {
    connectTimeout: 10000,
    retryStrategy: (times) => {
      return Math.min(times * 50, 2000)
    },
  })

  // Enable keyspace notifications for expiration events
  redis.config("SET", "notify-keyspace-events", "Ex")
}

// Enable keyspace notifications for expiration events
redis.config("SET", "notify-keyspace-events", "Ex")

// init rate limiter
export const rateLimiter = new RateLimiter({
  db: new Redis(env.REDIS_URL),
  max: 3,
  duration: 10_000,
})

export default redis
