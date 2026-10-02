<script setup lang="ts">
import { ChevronLeft, ChevronRight, Plus } from '@lucide/vue'
import {
  addDays,
  currentWorkweekStart,
  isWeekend,
  nextWorkday,
  toISODate,
  weekStartOf,
  workweekday,
  type TaskCategory,
} from '~/data/marketing'

definePageMeta({ title: 'Marketing Calendar' })

const today = toISODate(new Date())
const thisWeek = currentWorkweekStart(today)
const weekStart = ref(thisWeek)
// Monday–Friday only.
const range = computed(() => ({ from: weekStart.value, to: addDays(weekStart.value, 4) }))
const defaultTaskDate = isWeekend(today) ? nextWorkday(today) : today

const { tasksState, setTaskDone, addTask, deleteTask, pending } = useMarketingTasks(range)
const { themeFor } = useMarketingRoutine()

const dayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long' })
const shortFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const parse = (date: string) => new Date(`${date}T00:00:00`)

const days = computed(() =>
  Array.from({ length: 5 }, (_, index) => {
    const date = addDays(weekStart.value, index)
    const tasks = tasksState.value.filter((task) => task.date === date)
    return {
      date,
      weekday: dayFormat.format(parse(date)),
      label: shortFormat.format(parse(date)),
      theme: themeFor(workweekday(date))?.theme ?? '',
      tasks,
      done: tasks.filter((task) => task.completedBy).length,
      isToday: date === today,
      isPast: date < today,
    }
  }),
)

const weekLabel = computed(() => `${shortFormat.format(parse(range.value.from))} – ${shortFormat.format(parse(range.value.to))}`)
const weekDone = computed(() => tasksState.value.filter((task) => task.completedBy).length)

const showAdd = ref(false)
const addDate = ref(defaultTaskDate)

function openAdd(date: string) {
  addDate.value = date
  showAdd.value = true
}

async function onAdd(input: { date: string; title: string; category: TaskCategory; assignedTo: string | null }) {
  await addTask(input)
  if (input.date < range.value.from || input.date > range.value.to) weekStart.value = weekStartOf(input.date)
  showAdd.value = false
}

async function onDelete(id: number) {
  if (confirm('Delete this task?')) await deleteTask(id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <button type="button" class="filter-chip !px-2" aria-label="Previous week" @click="weekStart = addDays(weekStart, -7)">
          <ChevronLeft :size="16" />
        </button>
        <button type="button" class="filter-chip" @click="weekStart = thisWeek">This week</button>
        <button type="button" class="filter-chip !px-2" aria-label="Next week" @click="weekStart = addDays(weekStart, 7)">
          <ChevronRight :size="16" />
        </button>
        <p class="ml-2 font-display text-[16px] font-bold text-ink">{{ weekLabel }}</p>
      </div>
      <div class="flex items-center gap-4">
        <p class="text-[13px] text-muted">
          <span class="font-semibold text-ink">{{ weekDone }} of {{ tasksState.length }}</span> done this week
        </p>
        <button type="button" class="btn-primary inline-flex items-center gap-2 !px-5 !py-2.5" @click="openAdd(defaultTaskDate)">
          <Plus :size="16" /> Add Task
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" :class="{ 'opacity-60': pending }">
      <div
        v-for="day in days"
        :key="day.date"
        class="flex flex-col border bg-canvas"
        :class="day.isToday ? 'border-primary' : 'border-hairline'"
      >
        <div class="border-b border-hairline p-3" :class="day.isToday ? 'bg-primary text-on-primary' : 'bg-surface-soft'">
          <div class="flex items-baseline justify-between gap-2">
            <p class="text-[12px] font-bold uppercase tracking-wide" :class="day.isToday ? '' : 'text-muted'">
              {{ day.weekday }}
            </p>
            <p class="text-[12px]" :class="day.isToday ? '' : 'text-muted'">{{ day.isToday ? 'Today' : day.label }}</p>
          </div>
          <p class="mt-0.5 font-display text-[14px] font-bold" :class="day.isToday ? '' : 'text-ink'">{{ day.theme }}</p>
          <div class="mt-2 h-1 w-full" :class="day.isToday ? 'bg-white/25' : 'bg-surface-strong'">
            <div class="h-1 bg-success" :style="{ width: `${percent(day.done, day.tasks.length)}%` }" />
          </div>
        </div>

        <div class="flex-1 divide-y divide-hairline px-3" :class="{ 'opacity-75': day.isPast }">
          <MarketingTaskItem
            v-for="task in day.tasks"
            :key="task.id"
            :task="task"
            compact
            @toggle="setTaskDone(task.id, $event)"
            @delete="onDelete(task.id)"
          />
        </div>

        <button
          type="button"
          class="flex items-center gap-1 border-t border-hairline px-3 py-2 text-[12px] text-muted transition-colors hover:bg-surface-soft hover:text-ink"
          @click="openAdd(day.date)"
        >
          <Plus :size="14" /> Add task
        </button>
      </div>
    </div>

    <MarketingTaskModal v-model="showAdd" :date="addDate" @submit="onAdd" />
  </div>
</template>
