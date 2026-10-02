import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid task id' })

  const session = await getUserSession(event)
  const { done } = await readBody<{ done: boolean }>(event)

  const db = useDb()
  const task = await db.select().from(tables.marketingTasks).where(eq(tables.marketingTasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })

  const update = done
    ? { completedBy: session.data?.name ?? 'Unknown', completedAt: new Date().toISOString() }
    : { completedBy: null, completedAt: null }

  await db.update(tables.marketingTasks).set(update).where(eq(tables.marketingTasks.id, id))
  return { ...task, ...update }
})
