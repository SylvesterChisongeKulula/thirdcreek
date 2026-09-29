import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { useSession, type H3Event } from 'h3'
import type { StoreLocation } from '../../app/data/crm-contacts'

export function hashPassword(password: string) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 64)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const hash = Buffer.from(hashHex, 'hex')
  const candidate = scryptSync(password, salt, 64)
  return candidate.length === hash.length && timingSafeEqual(candidate, hash)
}

const SESSION_PASSWORD = (() => {
  const fromEnv = process.env.SESSION_PASSWORD
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_PASSWORD environment variable must be set in production')
  }
  return 'dev-only-thirdcreek-session-secret-do-not-use-in-production'
})()

export interface SessionUser {
  staffId: number
  name: string
  authRole: 'owner' | 'staff'
  location: StoreLocation
}

export function getUserSession(event: H3Event) {
  return useSession<Partial<SessionUser>>(event, {
    password: SESSION_PASSWORD,
    name: 'thirdcreek_session',
    maxAge: 60 * 60 * 24 * 7,
  })
}
