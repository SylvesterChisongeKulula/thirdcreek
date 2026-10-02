import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact id' })

  const session = await getUserSession(event)
  const db = useDb()
  const existing = await db.select().from(tables.contacts).where(eq(tables.contacts.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Contact not found' })

  const input = parseContactInput({ ...existing, ...(await readBody(event)) })
  assertBranchAccess(session.data, existing.location, 'edit a contact')
  assertBranchAccess(session.data, input.location, 'move a contact')

  await db.update(tables.contacts).set(input).where(eq(tables.contacts.id, id))
  return { ...existing, ...input }
})
