import { eq } from 'drizzle-orm'
import { leadStages, type LeadStage } from '../../../../../app/data/crm-leads'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  const session = await getUserSession(event)
  const user = session.data

  const { stage } = await readBody<{ stage: LeadStage }>(event)
  if (!leadStages.includes(stage)) throw createError({ statusCode: 400, statusMessage: 'Invalid stage' })

  const db = useDb()

  const lead = await db.select().from(tables.leads).where(eq(tables.leads.id, id)).get()
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })

  if (user?.authRole === 'staff' && lead.location !== user.location) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot modify a lead outside your branch' })
  }

  if (stage === lead.stage) return lead

  const lastUpdated = todayISO()

  await db.transaction(async (tx) => {
    await tx.update(tables.leads).set({ stage, lastUpdated }).where(eq(tables.leads.id, id))

    // Sales aren't recorded yet, so winning a lead only leaves a note on the client's profile.
    if (stage === 'Won' && lead.contactId) {
      await tx.insert(tables.contactNotes).values({
        contactId: lead.contactId,
        date: lastUpdated,
        author: user?.name ?? lead.assignedTo,
        text: `Lead won: ${lead.partsNeeded}.`,
      })
    }
  })

  return { ...lead, stage, lastUpdated }
})
