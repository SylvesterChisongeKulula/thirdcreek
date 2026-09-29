<script setup lang="ts">
import { Menu, Search, Bell, LogOut } from '@lucide/vue'

defineProps<{ title: string }>()
defineEmits<{ 'toggle-sidebar': [] }>()

const { user, logout } = useAuth()

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

      <h1 class="font-display font-bold text-lg text-ink shrink-0">{{ title }}</h1>

      <div class="relative ml-4 hidden max-w-md flex-1 items-center sm:flex">
        <Search :size="16" class="absolute left-3 text-muted" />
        <input type="search" placeholder="Search contacts, leads..." class="text-input py-[10px] pl-9" />
      </div>

      <div class="ml-auto flex shrink-0 items-center gap-4">
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
          aria-label="Notifications"
        >
          <Bell :size="18" />
        </button>
        <div class="flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-on-primary">
            {{ initials }}
          </div>
          <span class="hidden font-body text-[14px] text-ink md:inline">{{ user?.name }}</span>
        </div>
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink"
          aria-label="Log out"
          @click="handleLogout"
        >
          <LogOut :size="18" />
        </button>
      </div>
    </div>
  </header>
</template>
