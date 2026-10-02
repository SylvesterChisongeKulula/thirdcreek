<script setup lang="ts">
import { Menu, Bell, LogOut, KeyRound, ChevronDown } from '@lucide/vue'
import { notificationGroups, type AdminNotification } from '~/data/notifications'

defineProps<{ title: string }>()
defineEmits<{ 'toggle-sidebar': [] }>()

const { user, logout } = useAuth()
const toast = useToast()
const route = useRoute()

const initials = computed(() => {
  if (!user.value) return ''
  return user.value.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}

// ── Notifications ──────────────────────────────────────────────
const notificationsFetch = useFetch<AdminNotification[]>('/api/admin/notifications', {
  default: () => [],
})
const notifications = computed(() => notificationsFetch.data.value ?? [])
const grouped = computed(() =>
  notificationGroups
    .map((group) => ({ group, items: notifications.value.filter((item) => item.group === group) }))
    .filter((entry) => entry.items.length),
)
const badge = computed(() => (notifications.value.length > 99 ? '99+' : String(notifications.value.length)))

const toneDot: Record<AdminNotification['tone'], string> = {
  warning: 'bg-warning',
  primary: 'bg-primary',
  success: 'bg-success',
  error: 'bg-error',
}

// Derived from live data, so refresh when the user moves around and every few minutes.
watch(() => route.fullPath, () => notificationsFetch.refresh())
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(() => notificationsFetch.refresh(), 5 * 60 * 1000)))
onUnmounted(() => clearInterval(timer))

const openMenu = ref<'notifications' | 'user' | null>(null)
const toggle = (menu: 'notifications' | 'user') => (openMenu.value = openMenu.value === menu ? null : menu)

async function goTo(link: string) {
  openMenu.value = null
  await navigateTo(link)
}

// ── Change own password ────────────────────────────────────────
const showPassword = ref(false)
const passwordRef = ref<{ setError: (message: string) => void } | null>(null)

function openPassword() {
  openMenu.value = null
  showPassword.value = true
}

async function onChangePassword(input: { current: string; next: string }) {
  try {
    await $fetch('/api/auth/password', { method: 'POST', body: input })
    showPassword.value = false
    toast.show('Your password has been changed.', 'success')
  } catch (error) {
    passwordRef.value?.setError(apiErrorMessage(error))
  }
}
</script>

<template>
  <header class="sticky top-0 z-20 h-16 shrink-0 bg-canvas border-b border-hairline">
    <div class="flex h-full items-center gap-4 px-4 sm:px-6">
      <button
        type="button"
        class="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center"
        aria-label="Toggle menu"
        @click="$emit('toggle-sidebar')"
      >
        <Menu :size="22" />
      </button>

      <h1 class="font-display font-bold text-lg text-ink truncate">{{ title }}</h1>

      <div class="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <div class="relative">
          <button
            type="button"
            class="relative flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
            :aria-label="`Notifications (${notifications.length})`"
            :aria-expanded="openMenu === 'notifications'"
            @click="toggle('notifications')"
          >
            <Bell :size="18" />
            <span
              v-if="notifications.length"
              class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white"
            >
              {{ badge }}
            </span>
          </button>

          <div
            v-if="openMenu === 'notifications'"
            class="fixed inset-x-4 top-16 z-40 max-h-[70vh] overflow-y-auto border border-hairline bg-canvas shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-96"
          >
            <div class="flex items-center justify-between border-b border-hairline px-4 py-3">
              <p class="font-display text-[15px] font-bold text-ink">Needs attention</p>
              <span class="text-[12px] text-muted">{{ notifications.length }}</span>
            </div>
            <p v-if="!notifications.length" class="px-4 py-8 text-center text-[14px] text-muted">All caught up.</p>
            <div v-for="entry in grouped" :key="entry.group">
              <p class="label-uppercase bg-surface-soft px-4 py-1.5 text-[11px] text-muted">{{ entry.group }}</p>
              <button
                v-for="item in entry.items"
                :key="item.id"
                type="button"
                class="flex w-full items-start gap-3 border-b border-hairline px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-soft"
                @click="goTo(item.link)"
              >
                <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="toneDot[item.tone]" />
                <span class="min-w-0">
                  <span class="block text-[14px] text-ink">{{ item.title }}</span>
                  <span class="block truncate text-[12px] text-muted">{{ item.detail }}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div class="relative">
          <button
            type="button"
            class="flex items-center gap-2"
            :aria-expanded="openMenu === 'user'"
            aria-label="Account menu"
            @click="toggle('user')"
          >
            <span class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-on-primary">
              {{ initials }}
            </span>
            <span class="hidden font-body text-[14px] text-ink md:inline">{{ user?.name }}</span>
            <ChevronDown :size="14" class="hidden text-muted md:inline" />
          </button>

          <div
            v-if="openMenu === 'user'"
            class="absolute right-0 top-11 z-40 w-56 border border-hairline bg-canvas py-1 shadow-lg"
          >
            <p class="border-b border-hairline px-4 py-2 text-[12px] text-muted">
              {{ user?.authRole === 'owner' ? 'Owner' : 'Staff' }} · {{ user?.location }}
            </p>
            <button
              type="button"
              class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-ink hover:bg-surface-soft"
              @click="openPassword"
            >
              <KeyRound :size="16" class="text-muted" /> Change password
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] text-ink hover:bg-surface-soft"
              @click="handleLogout"
            >
              <LogOut :size="16" class="text-muted" /> Log out
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="openMenu" class="fixed inset-0 z-30" @click="openMenu = null" />

    <PasswordModal
      ref="passwordRef"
      v-model="showPassword"
      title="Change your password"
      require-current
      @submit="onChangePassword"
    />
  </header>
</template>
