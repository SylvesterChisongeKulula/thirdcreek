<script setup lang="ts">
import { ArrowUpRight, Trash2 } from '@lucide/vue'
import type { MarketingTask } from '~/data/marketing'

const props = defineProps<{ task: MarketingTask; showDate?: boolean; compact?: boolean }>()
const emit = defineEmits<{ toggle: [done: boolean]; delete: [] }>()

const done = computed(() => !!props.task.completedBy)
</script>

<template>
  <div class="group flex items-start gap-3" :class="compact ? 'py-2' : 'py-2.5'">
    <input
      type="checkbox"
      :checked="done"
      class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
      :aria-label="`Mark '${task.title}' as ${done ? 'not done' : 'done'}`"
      @change="emit('toggle', !done)"
    />
    <div class="min-w-0 flex-1">
      <p class="text-[14px] leading-snug" :class="done ? 'text-muted line-through' : 'text-ink'">{{ task.title }}</p>
      <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted">
        <span class="px-1.5 py-0.5 text-[11px] font-semibold" :class="taskCategoryClasses[task.category]">
          {{ task.category }}
        </span>
        <span v-if="showDate">{{ task.date }}</span>
        <span v-if="task.assignedTo && !done">For {{ task.assignedTo }}</span>
        <span v-if="done">Done by {{ task.completedBy }}</span>
        <NuxtLink v-if="task.link" :to="task.link" class="inline-flex items-center gap-0.5 text-primary hover:underline">
          Open <ArrowUpRight :size="12" />
        </NuxtLink>
      </div>
    </div>
    <button
      v-if="!task.routineKey"
      type="button"
      class="shrink-0 text-muted opacity-60 transition hover:text-error hover:opacity-100"
      aria-label="Delete task"
      @click="emit('delete')"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>
