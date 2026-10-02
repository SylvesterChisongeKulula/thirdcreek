import type { StoreLocation } from '~/data/crm-contacts'

export interface AuthUser {
  staffId: number
  name: string
  authRole: 'owner' | 'staff'
  location: StoreLocation
}

export function useAuth() {
  const { data: user, refresh } = useFetch<AuthUser | null>('/api/auth/me', {
    default: () => null,
  })

  async function login(name: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { name, password } })
    await refresh()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await refresh()
  }

  return { user, login, logout, refresh }
}
