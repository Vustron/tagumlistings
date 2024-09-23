// utils
import RateLimiter from "async-ratelimiter"
import { Redis } from "ioredis"

// configs
// import { env } from "@/lib/config/env.mjs"

// TODO(Vustron): nagbug and env sa url so e direct sa nato nig butang dri

const url =
  "rediss://default:AdkuAAIjcDFhMTE3MTFhZWI0NDk0OWEwODRlNzE4YTQ1NTNiOWUxOHAxMA@feasible-marmoset-55598.upstash.io:6379"

const getRedisUrl = () => {
  if (url) {
    return url
  }
  throw new Error("REDIS_URL is not defined")
}

const redis = new Redis(getRedisUrl(), {
  connectTimeout: 10000,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    console.log(
      `Retrying Redis connection... Attempt ${times}, retry in ${delay} ms`,
    )
    return delay
  },
})

redis.on("error", (err) => {
  console.error("Redis error:", err)
})

redis.config("SET", "notify-keyspace-events", "Ex").catch((err) => {
  console.error("Failed to configure keyspace notifications:", err)
})

export const rateLimiter = new RateLimiter({
  db: redis,
  max: 3,
  duration: 10_000,
})

export default redis
