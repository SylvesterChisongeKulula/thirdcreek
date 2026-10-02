import { eq, max } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parseRoutineInput(await readBody(event))
  const db = useDb()

  const base = `routine-${slugify(input.title).slice(0, 40) || 'task'}`
  let id = base
  let suffix = 2
  while (await db.select().from(tables.marketingRoutineTasks).where(eq(tables.marketingRoutineTasks.id, id)).get()) {
    id = `${base}-${suffix}`
    suffix += 1
  }
  const [maxRow] = await db.select({ last: max(tables.marketingRoutineTasks.sortOrder) }).from(tables.marketingRoutineTasks)

  const task = { ...input, id, sortOrder: (maxRow?.last ?? -1) + 1 }
  await db.insert(tables.marketingRoutineTasks).values(task)
  await resetUpcomingRoutineTasks(db, { key: id })
  return task
})
