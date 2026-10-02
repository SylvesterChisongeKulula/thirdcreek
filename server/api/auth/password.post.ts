import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await refreshSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })

  const { current, next } = await readBody<{ current?: string; next?: string }>(event)
  const db = useDb()
  const member = await db.select().from(tables.staff).where(eq(tables.staff.id, user.staffId)).get()
  if (!member?.passwordHash || !current || !verifyPassword(current, member.passwordHash)) {
    throw createError({ statusCode: 400, statusMessage: 'Your current password is incorrect' })
  }

  const password = assertPasswordStrength(next)
  await db.update(tables.staff).set({ passwordHash: hashPassword(password) }).where(eq(tables.staff.id, user.staffId))
  return { ok: true }
})
