<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    size?: 'lg' | 'sm'
    image?: string
    imageAlt?: string
  }>(),
  { size: 'lg' },
)
</script>

<template>
  <section class="relative bg-surface-dark text-on-dark overflow-hidden">
    <img
      v-if="image"
      :src="image"
      :alt="imageAlt ?? ''"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div v-if="image" class="absolute inset-0 bg-gradient-to-r from-surface-dark/95 via-surface-dark/85 to-surface-dark/60" />

    <div
      class="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10"
      :class="size === 'lg' ? 'py-20 sm:py-24' : 'py-14 sm:py-16'"
    >
      <p v-if="eyebrow" class="label-uppercase text-accent mb-4">{{ eyebrow }}</p>
      <h1
        class="font-display font-bold leading-tight max-w-3xl"
        :class="size === 'lg' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl'"
      >
        {{ title }}
      </h1>
      <p v-if="subtitle" class="font-body font-light text-on-dark-soft mt-6 max-w-2xl text-base sm:text-lg leading-relaxed">
        {{ subtitle }}
      </p>
      <div v-if="$slots.default" class="mt-8 flex flex-wrap gap-4">
        <slot />
      </div>
    </div>
  </section>
</template>
