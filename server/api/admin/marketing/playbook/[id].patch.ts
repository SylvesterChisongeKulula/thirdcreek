import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid item id' })

  const db = useDb()
  const existing = await db.select().from(tables.marketingPlaybookItems).where(eq(tables.marketingPlaybookItems.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Playbook item not found' })

  // The section never changes on edit.
  const input = parsePlaybookInput({ ...(await readBody(event)), section: existing.section })
  await db.update(tables.marketingPlaybookItems).set(input).where(eq(tables.marketingPlaybookItems.id, id))
  return { ...existing, ...input }
})
