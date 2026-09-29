<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  to?: string
  icon: Component
  label: string
  disabled?: boolean
}>()
</script>

<template>
  <NuxtLink v-if="!disabled && to" :to="to" class="sidebar-link" active-class="sidebar-link-active">
    <component :is="icon" :size="18" />
    <span>{{ label }}</span>
  </NuxtLink>
  <div v-else class="sidebar-link-disabled">
    <component :is="icon" :size="18" />
    <span>{{ label }}</span>
    <span class="ml-auto text-[10px] font-bold uppercase tracking-wide">Soon</span>
  </div>
</template>
