export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  if (!pathname.startsWith('/api/admin')) return

  const session = await getUserSession(event)
  if (!session.data?.staffId) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
})
