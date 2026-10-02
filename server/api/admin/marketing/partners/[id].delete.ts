import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing partner id' })

  const session = await getUserSession(event)
  if (session.data?.authRole !== 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Only the owner can delete partners' })
  }

  const db = useDb()
  await db.transaction(async (tx) => {
    // Explicit, in case SQLite foreign-key enforcement is off for this connection.
    await tx.update(tables.leads).set({ partnerId: null }).where(eq(tables.leads.partnerId, id))
    await tx.delete(tables.marketingPartners).where(eq(tables.marketingPartners.id, id))
  })
  return { ok: true }
})
