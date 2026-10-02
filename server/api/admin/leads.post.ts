import type { Lead } from '../../../app/data/crm-leads'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const db = useDb()
  const input = await parseLeadInput(db, await readBody(event))
  assertBranchAccess(session.data, input.location, 'create a lead')

  const id = await generateLeadId(db)
  const createdAt = todayISO()

  const lead: Lead = { ...input, id, stage: 'New Lead', createdAt, lastUpdated: createdAt }
  await db.insert(tables.leads).values(lead)
  return lead
})
