import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { useSession, type H3Event } from 'h3'
import * as tables from '../db/schema'
import { storeLocations, type StoreLocation } from '../../app/data/crm-contacts'

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

// Re-reads the logged-in staff member from the database so role, branch and access changes take
// effect on the next request instead of when the 7-day session cookie expires. Returns null (and
// clears the session) if the account is gone or its login was removed.
export async function refreshSessionUser(event: H3Event): Promise<SessionUser | null> {
  const session = await getUserSession(event)
  const staffId = session.data?.staffId
  if (!staffId) return null

  const member = await useDb().select().from(tables.staff).where(eq(tables.staff.id, staffId)).get()
  if (!member?.passwordHash) {
    await session.clear()
    return null
  }

  const current: SessionUser = {
    staffId: member.id,
    name: member.name,
    authRole: member.authRole,
    location: member.location,
  }
  const data = session.data
  if (data.name !== current.name || data.authRole !== current.authRole || data.location !== current.location) {
    await session.update(current)
  }
  return current
}

export const MIN_PASSWORD_LENGTH = 8

export function assertPasswordStrength(password: unknown): string {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `Passwords must be at least ${MIN_PASSWORD_LENGTH} characters` })
  }
  return password
}

type StaffRow = typeof tables.staff.$inferSelect

// Guards against locking everyone out: there must always be at least one owner who can log in.
export async function assertOtherActiveOwner(exceptId: number) {
  const owners = await useDb().select().from(tables.staff).where(eq(tables.staff.authRole, 'owner')).all()
  if (!owners.some((owner: StaffRow) => owner.id !== exceptId && owner.passwordHash)) {
    throw createError({ statusCode: 400, statusMessage: 'There must always be at least one owner who can log in' })
  }
}

export function parseStaffFields(body: { role?: unknown; location?: unknown; authRole?: unknown }) {
  const role = typeof body.role === 'string' ? body.role.trim() : ''
  if (!role) throw createError({ statusCode: 400, statusMessage: 'Role is required' })
  if (typeof body.location !== 'string' || !storeLocations.includes(body.location as StoreLocation)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid branch' })
  }
  if (body.authRole !== 'owner' && body.authRole !== 'staff') {
    throw createError({ statusCode: 400, statusMessage: 'Access must be owner or staff' })
  }
  return { role, location: body.location as StoreLocation, authRole: body.authRole as 'owner' | 'staff' }
}
