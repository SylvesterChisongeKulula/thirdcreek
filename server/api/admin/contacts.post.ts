import type { Contact } from '../../../app/data/crm-contacts'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.data

  const body = await readBody<Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>>(event)

  if (user?.authRole === 'staff' && body.location !== user.location) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot create a contact outside your branch' })
  }

  return createContactRecord(useDb(), body)
})
