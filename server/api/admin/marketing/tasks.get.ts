import { and, asc, gte, lte } from 'drizzle-orm'

const MAX_RANGE_DAYS = 42

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const from = assertISODate(query.from, 'from')
  const to = assertISODate(query.to, 'to')

  const days = (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000
  if (days < 0 || days > MAX_RANGE_DAYS) {
    throw createError({ statusCode: 400, statusMessage: `Date range must be 0–${MAX_RANGE_DAYS} days` })
  }

  const db = useDb()
  await ensureRoutineTasks(db, from, to)

  return db
    .select()
    .from(tables.marketingTasks)
    .where(and(gte(tables.marketingTasks.date, from), lte(tables.marketingTasks.date, to)))
    .orderBy(asc(tables.marketingTasks.date), asc(tables.marketingTasks.id))
    .all()
})
