import { eq } from 'drizzle-orm'

// Name is not editable: leads store the assigned person by name.
export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid staff id' })

  const db = useDb()
  const existing = await db.select().from(tables.staff).where(eq(tables.staff.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Staff member not found' })

  const fields = parseStaffFields({ ...existing, ...(await readBody(event)) })
  if (existing.authRole === 'owner' && fields.authRole !== 'owner') await assertOtherActiveOwner(id)

  await db.update(tables.staff).set(fields).where(eq(tables.staff.id, id))
  return { id, name: existing.name, ...fields, hasLogin: !!existing.passwordHash }
})
