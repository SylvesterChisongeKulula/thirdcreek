import type { Lead } from '../../../app/data/crm-leads'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.data

  const body = await readBody<Omit<Lead, 'id' | 'stage' | 'createdAt' | 'lastUpdated'>>(event)

  if (user?.authRole === 'staff' && body.location !== user.location) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot create a lead outside your branch' })
  }

  const db = useDb()
  const id = await generateLeadId(db)
  const createdAt = todayISO()

  const lead: Lead = { ...body, id, stage: 'New Lead', createdAt, lastUpdated: createdAt }
  await db.insert(tables.leads).values(lead)
  return lead
})
