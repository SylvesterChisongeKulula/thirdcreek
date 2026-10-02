import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing routine task id' })

  const db = useDb()
  await db.delete(tables.marketingRoutineTasks).where(eq(tables.marketingRoutineTasks.id, id))
  await resetUpcomingRoutineTasks(db, { key: id })
  return { ok: true }
})
