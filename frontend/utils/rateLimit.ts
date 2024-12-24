import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  WINDOW_SECONDS: 1800, // 30 minutes
}

export async function checkRateLimit(email: string): Promise<{
  success: boolean
  limit: number
  remaining: number
  reset: number
}> {
  const key = `email_resend:${email}`
  const now = Math.floor(Date.now() / 1000)

  // Get current attempts with scores
  const entries = await redis.zrange(key, 0, -1, {
    withScores: true,
  })

  // Handle Redis response format properly
  // Redis returns array in format [member1, score1, member2, score2, ...]
  const validEntries = []
  for (let i = 0; i < entries.length; i += 2) {
    const timestamp = entries[i + 1] as number
    if (timestamp > now - RATE_LIMIT.WINDOW_SECONDS) {
      validEntries.push(timestamp)
    }
  }

  // Count valid attempts
  const attemptCount = validEntries.length

  if (attemptCount >= RATE_LIMIT.MAX_ATTEMPTS) {
    // Get oldest timestamp to calculate reset time
    const oldestTimestamp = validEntries[0] || now
    const reset = Math.floor(oldestTimestamp) + RATE_LIMIT.WINDOW_SECONDS

    return {
      success: false,
      limit: RATE_LIMIT.MAX_ATTEMPTS,
      remaining: 0,
      reset,
    }
  }

  return {
    success: true,
    limit: RATE_LIMIT.MAX_ATTEMPTS,
    remaining: RATE_LIMIT.MAX_ATTEMPTS - attemptCount,
    reset: now + RATE_LIMIT.WINDOW_SECONDS,
  }
}

export async function recordAttempt(email: string): Promise<void> {
  const key = `email_resend:${email}`
  const now = Math.floor(Date.now() / 1000)

  // Add new attempt
  await redis.zadd(key, { score: now, member: now.toString() })

  // Set expiry to auto-cleanup
  await redis.expire(key, RATE_LIMIT.WINDOW_SECONDS)
}