import { eq } from 'drizzle-orm'

// { password } sets a new password; { remove: true } removes the login (the record is kept so
// leads assigned to this person still make sense).
export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid staff id' })

  const db = useDb()
  const existing = await db.select().from(tables.staff).where(eq(tables.staff.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Staff member not found' })

  const body = await readBody<{ password?: string; remove?: boolean }>(event)
  if (body.remove) {
    if (existing.authRole === 'owner') await assertOtherActiveOwner(id)
    await db.update(tables.staff).set({ passwordHash: null }).where(eq(tables.staff.id, id))
    return { ok: true, hasLogin: false }
  }

  const password = assertPasswordStrength(body.password)
  await db.update(tables.staff).set({ passwordHash: hashPassword(password) }).where(eq(tables.staff.id, id))
  return { ok: true, hasLogin: true }
})
