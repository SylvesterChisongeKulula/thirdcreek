export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.data

  const allLeads = await useDb().select().from(tables.leads).all()
  if (user?.authRole === 'staff') {
    return allLeads.filter((lead) => lead.location === user.location)
  }
  return allLeads
})
