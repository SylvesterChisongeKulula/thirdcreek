import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  const session = await getUserSession(event)
  const db = useDb()
  const existing = await db.select().from(tables.leads).where(eq(tables.leads.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })

  // Stage changes go through the stage endpoint; this edits the lead's details only.
  const { stage: _stage, ...body } = await readBody<Record<string, unknown>>(event)
  const input = await parseLeadInput(db, { ...existing, contactId: existing.contactId ?? undefined, ...body })
  assertBranchAccess(session.data, existing.location, 'edit a lead')
  assertBranchAccess(session.data, input.location, 'move a lead')

  const lastUpdated = todayISO()
  const values = { ...input, contactId: input.contactId ?? null, lastUpdated }
  await db.update(tables.leads).set(values).where(eq(tables.leads.id, id))
  return { ...existing, ...values }
})
