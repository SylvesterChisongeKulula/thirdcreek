<script setup lang="ts">
import { whyChooseUs } from '~/data/company'
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <span
      v-for="item in whyChooseUs"
      :key="item"
      class="px-4 py-2 bg-surface-card text-[13px] font-semibold text-ink border border-hairline"
    >
      {{ item }}
    </span>
  </div>
</template>
