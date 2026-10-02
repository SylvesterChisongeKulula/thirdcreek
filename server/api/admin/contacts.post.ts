export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const input = parseContactInput(await readBody(event))
  assertBranchAccess(session.data, input.location, 'create a contact')
  return createContactRecord(useDb(), input)
})
