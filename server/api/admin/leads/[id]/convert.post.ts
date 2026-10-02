import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  const session = await getUserSession(event)
  const input = parseContactInput(await readBody(event))
  const db = useDb()

  const lead = await db.select().from(tables.leads).where(eq(tables.leads.id, id)).get()
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })
  if (lead.contactId) throw createError({ statusCode: 409, statusMessage: 'This lead is already linked to a contact' })

  assertBranchAccess(session.data, lead.location, 'convert a lead')
  assertBranchAccess(session.data, input.location, 'convert a lead')

  const contact = await createContactRecord(db, input)
  await db.update(tables.leads).set({ contactId: contact.id, lastUpdated: todayISO() }).where(eq(tables.leads.id, id))

  return contact
})
