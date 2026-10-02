import { eq } from 'drizzle-orm'
import { playbookSectionMeta } from '../../../../../app/data/marketing'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid item id' })

  const db = useDb()
  const existing = await db.select().from(tables.marketingPlaybookItems).where(eq(tables.marketingPlaybookItems.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Playbook item not found' })
  if (playbookSectionMeta[existing.section].single) {
    throw createError({ statusCode: 400, statusMessage: 'This item can be edited but not deleted' })
  }

  await db.delete(tables.marketingPlaybookItems).where(eq(tables.marketingPlaybookItems.id, id))
  return { ok: true }
})
