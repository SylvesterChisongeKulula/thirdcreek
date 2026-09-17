<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    align?: 'left' | 'center'
  }>(),
  { align: 'left' },
)
</script>

<template>
  <div :class="['max-w-2xl', align === 'center' ? 'mx-auto text-center' : '']">
    <p v-if="eyebrow" class="label-uppercase text-accent mb-3">{{ eyebrow }}</p>
    <h2 class="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight">{{ title }}</h2>
    <p v-if="subtitle" class="font-body font-light text-body mt-4 text-base leading-relaxed">
      {{ subtitle }}
    </p>
  </div>
</template>
