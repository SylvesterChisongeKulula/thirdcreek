import { eq } from 'drizzle-orm'
import type { Contact } from '../../../../../app/data/crm-contacts'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  const session = await getUserSession(event)
  const user = session.data

  const body = await readBody<Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>>(event)
  const db = useDb()

  const lead = await db.select().from(tables.leads).where(eq(tables.leads.id, id)).get()
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })

  if (user?.authRole === 'staff' && (lead.location !== user.location || body.location !== user.location)) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot convert a lead outside your branch' })
  }

  const contact = await createContactRecord(db, body)
  await db.update(tables.leads).set({ contactId: contact.id, lastUpdated: todayISO() }).where(eq(tables.leads.id, id))

  return contact
})
