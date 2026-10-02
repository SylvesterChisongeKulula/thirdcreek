import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing partner id' })

  const db = useDb()
  const existing = await db.select().from(tables.marketingPartners).where(eq(tables.marketingPartners.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Partner not found' })

  // Accepts a partial body (e.g. just { status }) and fills the rest from the stored partner.
  const input = parsePartnerInput({ ...existing, ...(await readBody(event)) })
  await assertReferralCodeFree(db, input.referralCode, id)

  const updatedAt = todayISO()
  await db.update(tables.marketingPartners).set({ ...input, updatedAt }).where(eq(tables.marketingPartners.id, id))
  return { ...existing, ...input, updatedAt }
})
