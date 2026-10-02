import { isWeekend, taskCategories, type TaskCategory } from '../../../../app/data/marketing'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ date: string; title: string; category: TaskCategory; assignedTo?: string | null }>(event)

  const date = assertISODate(body.date, 'date')
  if (isWeekend(date)) {
    throw createError({ statusCode: 400, statusMessage: 'The marketing calendar runs Monday to Friday' })
  }
  const title = body.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  if (!taskCategories.includes(body.category)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category' })
  }

  const [task] = await useDb()
    .insert(tables.marketingTasks)
    .values({ date, title, category: body.category, assignedTo: body.assignedTo || null, createdAt: todayISO() })
    .returning()
  return task
})
