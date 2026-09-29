<script setup lang="ts">
defineProps<{
  date: string
  text: string
  author?: string
}>()
</script>

<template>
  <div class="flex gap-3 border-b border-hairline py-3 last:border-b-0">
    <div class="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
    <div class="min-w-0">
      <p class="font-body text-[14px] text-ink">{{ text }}</p>
      <p class="mt-0.5 text-[12px] text-muted">
        <span v-if="author">{{ author }} · </span>{{ date }}
      </p>
    </div>
  </div>
</template>
