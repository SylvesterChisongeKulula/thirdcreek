<script setup lang="ts">
import { Pencil, Trash2 } from '@lucide/vue'
import type { RoutineTaskDef } from '~/data/marketing'

defineProps<{ task: RoutineTaskDef; linkLabel?: string; editable: boolean }>()
const emit = defineEmits<{ edit: []; delete: [] }>()
</script>

<template>
  <div class="min-w-0 flex-1">
    <p class="text-[14px] leading-snug text-ink">{{ task.title }}</p>
    <div class="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted">
      <span class="px-1.5 py-0.5 text-[11px] font-semibold" :class="taskCategoryClasses[task.category]">{{ task.category }}</span>
      <span v-if="linkLabel">→ {{ linkLabel }}</span>
    </div>
  </div>
  <template v-if="editable">
    <button type="button" class="shrink-0 text-muted hover:text-ink" aria-label="Edit routine task" @click="emit('edit')">
      <Pencil :size="14" />
    </button>
    <button type="button" class="shrink-0 text-muted hover:text-error" aria-label="Remove routine task" @click="emit('delete')">
      <Trash2 :size="14" />
    </button>
  </template>
</template>
