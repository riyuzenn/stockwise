const attempts = new Map<string, { count: number; time: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export function checkRateLimit(key: string) {
  const now = Date.now()
  const entry = attempts.get(key)

  if (!entry) {
    attempts.set(key, { count: 1, time: now })
    return true
  }

  if (now - entry.time > WINDOW_MS) {
    attempts.set(key, { count: 1, time: now })
    return true
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false
  }

  entry.count++
  return true
}
