import { eq } from 'drizzle-orm'
import type { LeadStage } from '../../../../../app/data/crm-leads'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing lead id' })

  const session = await getUserSession(event)
  const user = session.data

  const { stage } = await readBody<{ stage: LeadStage }>(event)
  const db = useDb()

  const lead = await db.select().from(tables.leads).where(eq(tables.leads.id, id)).get()
  if (!lead) throw createError({ statusCode: 404, statusMessage: 'Lead not found' })

  if (user?.authRole === 'staff' && lead.location !== user.location) {
    throw createError({ statusCode: 403, statusMessage: 'Cannot modify a lead outside your branch' })
  }

  const lastUpdated = todayISO()

  await db.transaction(async (tx) => {
    await tx.update(tables.leads).set({ stage, lastUpdated }).where(eq(tables.leads.id, id))

    if (stage === 'Won' && lead.contactId) {
      await tx.insert(tables.purchases).values({
        contactId: lead.contactId,
        date: lastUpdated,
        item: lead.partsNeeded,
        amount: lead.estimatedValue,
      })
      await tx.insert(tables.contactNotes).values({
        contactId: lead.contactId,
        date: lastUpdated,
        author: lead.assignedTo,
        text: `Lead won: ${lead.partsNeeded} (${currency(lead.estimatedValue)}).`,
      })
    }
  })

  return { ...lead, stage, lastUpdated }
})
