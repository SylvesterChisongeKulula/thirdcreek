<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'

defineProps<{ deletable?: boolean }>()
const emit = defineEmits<{ edit: []; delete: [] }>()
</script>

<template>
  <span class="inline-flex shrink-0 items-center gap-2">
    <button type="button" class="text-muted hover:text-ink" aria-label="Edit" @click="emit('edit')">
      <Pencil :size="14" />
    </button>
    <button v-if="deletable" type="button" class="text-muted hover:text-error" aria-label="Delete" @click="emit('delete')">
      <Trash2 :size="14" />
    </button>
  </span>
</template>
