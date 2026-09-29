export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  const requestFetch = useRequestFetch()
  const user = await requestFetch('/api/auth/me').catch(() => null)
  if (!user) {
    return navigateTo('/login')
  }
})
