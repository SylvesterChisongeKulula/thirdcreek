import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  return useDb().select().from(tables.marketingPartners).orderBy(asc(tables.marketingPartners.name)).all()
})
