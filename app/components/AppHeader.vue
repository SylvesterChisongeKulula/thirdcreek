<script setup lang="ts">
import { Menu, X, MessageCircle } from '@lucide/vue'
import { contact } from '~/data/company'

const isMenuOpen = ref(false)

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Auto Spares', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <header class="sticky top-0 z-50 h-16 bg-canvas border-b border-hairline">
    <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <img src="/logo.png" alt="Third Creek Auto Spares" class="h-9 w-auto" />
      </NuxtLink>

      <nav class="hidden lg:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-body text-[14px] text-ink hover:text-primary transition-colors"
          active-class="text-primary font-semibold"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="hidden lg:flex items-center gap-3">
        <a
          :href="`https://wa.me/${contact.phonePrimaryIntl}`"
          target="_blank"
          rel="noopener"
          class="btn-primary inline-flex items-center gap-2"
        >
          <MessageCircle :size="16" />
          WhatsApp Us
        </a>
      </div>

      <button
        type="button"
        class="lg:hidden flex h-11 w-11 items-center justify-center"
        aria-label="Toggle menu"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sr-only">Menu</span>
        <Menu v-if="!isMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </div>

    <div v-if="isMenuOpen" class="lg:hidden bg-canvas border-t border-hairline">
      <nav class="flex flex-col px-4 py-4 gap-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="font-body text-[15px] text-ink py-3 border-b border-hairline last:border-b-0"
          active-class="text-primary font-semibold"
        >
          {{ link.label }}
        </NuxtLink>
        <a
          :href="`https://wa.me/${contact.phonePrimaryIntl}`"
          target="_blank"
          rel="noopener"
          class="btn-primary mt-4 justify-center inline-flex items-center gap-2"
        >
          <MessageCircle :size="16" />
          WhatsApp Us
        </a>
      </nav>
    </div>
  </header>
</template>
