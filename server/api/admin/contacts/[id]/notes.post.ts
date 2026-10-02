import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact id' })

  const session = await getUserSession(event)
  const { text } = await readBody<{ text?: string }>(event)
  const noteText = text?.trim()
  if (!noteText) throw createError({ statusCode: 400, statusMessage: 'Note text is required' })

  const db = useDb()
  const contact = await db.select().from(tables.contacts).where(eq(tables.contacts.id, id)).get()
  if (!contact) throw createError({ statusCode: 404, statusMessage: 'Contact not found' })
  assertBranchAccess(session.data, contact.location, 'add a note')

  const note = { date: todayISO(), author: session.data?.name ?? 'Unknown', text: noteText }
  await db.insert(tables.contactNotes).values({ ...note, contactId: id })
  return note
})
