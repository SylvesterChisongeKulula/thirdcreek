<script setup lang="ts">
definePageMeta({ layout: 'admin', title: 'Marketing' })

const tabs = [
  { to: '/admin/marketing', label: 'Overview' },
  { to: '/admin/marketing/calendar', label: 'Calendar' },
  { to: '/admin/marketing/routine', label: 'Routine' },
  { to: '/admin/marketing/partners', label: 'Partners' },
  { to: '/admin/marketing/metrics', label: 'Metrics' },
  { to: '/admin/marketing/playbook', label: 'Playbook' },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <nav class="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div class="flex min-w-max gap-1 border-b border-hairline">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="-mb-px border-b-2 border-transparent px-4 py-2.5 text-[14px] text-muted transition-colors hover:text-ink"
          exact-active-class="!border-primary font-semibold !text-ink"
        >
          {{ tab.label }}
        </NuxtLink>
      </div>
    </nav>

    <NuxtPage />
  </div>
</template>
