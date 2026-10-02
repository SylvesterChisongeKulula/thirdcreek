export default defineEventHandler(async (event) => {
  const input = parsePartnerInput(await readBody(event))
  const db = useDb()
  await assertReferralCodeFree(db, input.referralCode)

  const id = await generatePartnerId(db, input.name)
  const now = todayISO()
  const partner = { ...input, id, createdAt: now, updatedAt: now }
  await db.insert(tables.marketingPartners).values(partner)
  return partner
})
