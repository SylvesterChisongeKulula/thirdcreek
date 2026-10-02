import { eq, max } from 'drizzle-orm'
import { playbookSectionMeta } from '../../../../app/data/marketing'

export default defineEventHandler(async (event) => {
  await requireOwner(event)
  const input = parsePlaybookInput(await readBody(event))
  if (playbookSectionMeta[input.section].single) {
    throw createError({ statusCode: 400, statusMessage: 'This section has a single item — edit it instead' })
  }

  const db = useDb()
  const [maxRow] = await db
    .select({ last: max(tables.marketingPlaybookItems.sortOrder) })
    .from(tables.marketingPlaybookItems)
    .where(eq(tables.marketingPlaybookItems.section, input.section))

  const [item] = await db
    .insert(tables.marketingPlaybookItems)
    .values({ ...input, sortOrder: (maxRow?.last ?? -1) + 1 })
    .returning()
  return item
})
