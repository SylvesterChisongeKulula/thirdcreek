<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { playbookSectionMeta, type PlaybookSection } from '~/data/marketing'

defineProps<{ section: PlaybookSection; editing: boolean }>()
const emit = defineEmits<{ add: [] }>()
</script>

<template>
  <div class="mb-3 flex items-center justify-between gap-2">
    <p class="label-uppercase text-muted">{{ playbookSectionMeta[section].label }}</p>
    <button v-if="editing && !playbookSectionMeta[section].single" type="button" class="text-link-cta" @click="emit('add')">
      <Plus :size="14" /> Add
    </button>
  </div>
</template>
