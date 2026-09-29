export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const user = session.data

  const allContacts = await getFullContacts(useDb())
  if (user?.authRole === 'staff') {
    return allContacts.filter((contact) => contact.location === user.location)
  }
  return allContacts
})
