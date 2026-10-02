import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  const [themes, tasks] = await Promise.all([
    db.select().from(tables.marketingDayThemes).orderBy(asc(tables.marketingDayThemes.weekday)).all(),
    db.select().from(tables.marketingRoutineTasks).orderBy(asc(tables.marketingRoutineTasks.sortOrder)).all(),
  ])
  return { themes, tasks }
})
