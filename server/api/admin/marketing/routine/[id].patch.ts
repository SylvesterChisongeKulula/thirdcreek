import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing routine task id' })

  const db = useDb()
  const existing = await db.select().from(tables.marketingRoutineTasks).where(eq(tables.marketingRoutineTasks.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Routine task not found' })

  const input = parseRoutineInput({ ...existing, ...(await readBody(event)) })
  await db.update(tables.marketingRoutineTasks).set(input).where(eq(tables.marketingRoutineTasks.id, id))
  await resetUpcomingRoutineTasks(db, { key: id })
  return { ...existing, ...input }
})
