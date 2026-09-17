<script setup lang="ts">
import { Stethoscope, Disc3, Wrench, Droplet, PackageSearch } from '@lucide/vue'
import type { Service, ServiceIcon } from '~/data/services'

defineProps<{ service: Service }>()

const icons: Record<ServiceIcon, typeof Stethoscope> = {
  Stethoscope,
  Disc3,
  Wrench,
  Droplet,
  PackageSearch,
}
</script>

<template>
  <article class="bg-canvas p-6 border border-hairline h-full flex flex-col">
    <div class="h-14 w-14 bg-surface-card flex items-center justify-center mb-5">
      <component :is="icons[service.icon]" :size="26" class="text-primary" />
    </div>
    <h3 class="font-display font-bold text-lg text-ink mb-2">{{ service.title }}</h3>
    <p class="font-body font-light text-[14px] text-body leading-relaxed mb-4 flex-1">{{ service.description }}</p>
    <p v-if="service.note" class="text-[12px] tracking-wide uppercase font-bold text-primary">{{ service.note }}</p>
  </article>
</template>
