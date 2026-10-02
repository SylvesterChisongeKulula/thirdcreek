import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing contact id' })

  const db = useDb()
  await db.transaction(async (tx) => {
    // Explicit rather than relying on FK actions, in case enforcement is off for this connection.
    await tx.update(tables.leads).set({ contactId: null }).where(eq(tables.leads.contactId, id))
    await tx.delete(tables.contactNotes).where(eq(tables.contactNotes.contactId, id))
    await tx.delete(tables.purchases).where(eq(tables.purchases.contactId, id))
    await tx.delete(tables.contacts).where(eq(tables.contacts.id, id))
  })
  return { ok: true }
})
