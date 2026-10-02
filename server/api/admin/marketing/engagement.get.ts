import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  return useDb().select().from(tables.marketingEngagement).orderBy(desc(tables.marketingEngagement.weekStart)).all()
})
