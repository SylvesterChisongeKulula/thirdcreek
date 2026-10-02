import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  return useDb()
    .select()
    .from(tables.marketingPlaybookItems)
    .orderBy(asc(tables.marketingPlaybookItems.sortOrder), asc(tables.marketingPlaybookItems.id))
    .all()
})
