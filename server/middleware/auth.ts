export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)
  if (!pathname.startsWith('/api/admin')) return

  if (!(await refreshSessionUser(event))) {
    throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
  }
})
