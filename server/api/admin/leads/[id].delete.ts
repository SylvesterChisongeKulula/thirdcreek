import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  await useDb().delete(tables.leads).where(eq(tables.leads.id, id))
  return { ok: true }
})
