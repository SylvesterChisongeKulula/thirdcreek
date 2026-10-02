import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const body = await readBody<{ name?: string; role?: string; location?: string; authRole?: string; password?: string }>(event)

  const name = body.name?.trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  const fields = parseStaffFields(body)
  const password = assertPasswordStrength(body.password)

  const db = useDb()
  if (await db.select().from(tables.staff).where(eq(tables.staff.name, name)).get()) {
    throw createError({ statusCode: 409, statusMessage: 'Someone with this name already exists' })
  }

  const [member] = await db
    .insert(tables.staff)
    .values({ name, ...fields, passwordHash: hashPassword(password) })
    .returning({ id: tables.staff.id })
  return { id: member!.id, name, ...fields, hasLogin: true }
})
