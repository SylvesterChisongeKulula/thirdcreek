import type { H3Event } from 'h3'

// In-memory brute-force protection for the login form: 5 failed attempts for the same name from the
// same IP locks that pair out for 15 minutes. Resets on a successful login or a server restart.
const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000

const failures = new Map<string, { count: number; firstAt: number }>()

function throttleKey(event: H3Event, name: string) {
  return `${getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'}|${name.trim().toLowerCase()}`
}

export function assertLoginAllowed(event: H3Event, name: string) {
  const entry = failures.get(throttleKey(event, name))
  if (!entry) return
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    failures.delete(throttleKey(event, name))
    return
  }
  if (entry.count >= MAX_FAILURES) {
    const minutes = Math.ceil((entry.firstAt + WINDOW_MS - Date.now()) / 60_000)
    throw createError({ statusCode: 429, statusMessage: `Too many attempts — try again in ${minutes} minutes` })
  }
}

export function recordLoginFailure(event: H3Event, name: string) {
  const key = throttleKey(event, name)
  const entry = failures.get(key)
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) failures.set(key, { count: 1, firstAt: Date.now() })
  else entry.count += 1
}

export function clearLoginFailures(event: H3Event, name: string) {
  failures.delete(throttleKey(event, name))
}
