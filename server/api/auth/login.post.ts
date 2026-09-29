import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { name, password } = await readBody<{ name: string; password: string }>(event)
  if (!name || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Name and password are required' })
  }

  const db = useDb()
  const staffMember = await db.select().from(tables.staff).where(eq(tables.staff.name, name)).get()

  if (!staffMember || !staffMember.passwordHash || !verifyPassword(password, staffMember.passwordHash)) {
    throw createError({ statusCode: 401, statusMessage: 'Name or password is incorrect' })
  }

  const session = await getUserSession(event)
  await session.update({
    staffId: staffMember.id,
    name: staffMember.name,
    authRole: staffMember.authRole,
    location: staffMember.location,
  })

  return session.data
})
