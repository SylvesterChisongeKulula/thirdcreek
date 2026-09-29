<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  icon: Component
}>()
</script>

<template>
  <div class="kpi-card">
    <div class="flex items-center justify-between">
      <span class="label-uppercase text-muted">{{ label }}</span>
      <component :is="icon" :size="18" class="text-muted" />
    </div>
    <p class="font-display font-bold text-2xl text-ink">{{ value }}</p>
    <p
      v-if="delta"
      class="text-[13px] font-body"
      :class="{
        'text-success': trend === 'up',
        'text-error': trend === 'down',
        'text-muted': !trend || trend === 'flat',
      }"
    >
      {{ delta }}
    </p>
  </div>
</template>
