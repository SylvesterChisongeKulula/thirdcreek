import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid task id' })

  const db = useDb()
  const task = await db.select().from(tables.marketingTasks).where(eq(tables.marketingTasks.id, id)).get()
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  if (task.routineKey) {
    throw createError({ statusCode: 400, statusMessage: 'Routine tasks cannot be deleted' })
  }

  await db.delete(tables.marketingTasks).where(eq(tables.marketingTasks.id, id))
  return { ok: true }
})
