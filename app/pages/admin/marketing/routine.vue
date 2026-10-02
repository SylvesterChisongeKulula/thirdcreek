<script setup lang="ts">
import { Pencil, Plus } from '@lucide/vue'
import { taskLinkOptions, weekdayNames, type RoutineTaskDef } from '~/data/marketing'
import type { RoutineInput } from '~/composables/useMarketing'

definePageMeta({ title: 'Marketing Routine' })

const { routineState, themeFor, saveTheme, addRoutineTask, updateRoutineTask, deleteRoutineTask } = useMarketingRoutine()
const { user } = useAuth()
const isOwner = computed(() => user.value?.authRole === 'owner')

const linkLabel = (link: string | null) => taskLinkOptions.find((option) => option.value === link)?.label

const everyDayTasks = computed(() => routineState.value.filter((task) => task.weekday === null))
const tasksOn = (weekday: number) => routineState.value.filter((task) => task.weekday === weekday)

// Inline theme editing
const editingDay = ref<number | null>(null)
const themeForm = reactive({ theme: '', example: '' })
const themeError = ref('')

function editTheme(weekday: number) {
  const current = themeFor(weekday)
  Object.assign(themeForm, { theme: current?.theme ?? '', example: current?.example ?? '' })
  themeError.value = ''
  editingDay.value = weekday
}

async function submitTheme() {
  if (editingDay.value === null) return
  if (!themeForm.theme.trim()) {
    themeError.value = 'A theme is required.'
    return
  }
  try {
    await saveTheme(editingDay.value, { theme: themeForm.theme.trim(), example: themeForm.example.trim() })
    editingDay.value = null
  } catch (error) {
    themeError.value = apiErrorMessage(error)
  }
}

// Routine task modal
const showModal = ref(false)
const editingTask = ref<RoutineTaskDef | null>(null)
const modalWeekday = ref<number | null>(null)
const modalRef = ref<{ setError: (message: string) => void } | null>(null)

function openAdd(weekday: number | null) {
  editingTask.value = null
  modalWeekday.value = weekday
  showModal.value = true
}

function openEdit(task: RoutineTaskDef) {
  editingTask.value = task
  showModal.value = true
}

async function onSubmit(input: RoutineInput) {
  try {
    if (editingTask.value) await updateRoutineTask(editingTask.value.id, input)
    else await addRoutineTask(input)
    showModal.value = false
  } catch (error) {
    modalRef.value?.setError(apiErrorMessage(error))
  }
}

async function onDelete(task: RoutineTaskDef) {
  if (confirm(`Remove "${task.title}" from the routine? Past and ticked-off tasks are kept.`)) {
    await deleteRoutineTask(task.id)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="max-w-3xl text-[14px] text-muted">
      The weekly routine fills the calendar automatically, Monday to Friday.
      <template v-if="isOwner">Changes apply from today onwards.</template>
      <template v-else>Only the owner can change it.</template>
    </p>

    <div class="crm-panel">
      <div class="mb-2 flex items-center justify-between gap-2">
        <p class="label-uppercase text-muted">Every Weekday</p>
        <button v-if="isOwner" type="button" class="text-link-cta" @click="openAdd(null)"><Plus :size="14" /> Add</button>
      </div>
      <div class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="task in everyDayTasks" :key="task.id" class="flex items-start gap-2 border-b border-hairline py-2.5">
          <RoutineTaskRow :task="task" :link-label="linkLabel(task.link)" :editable="isOwner" @edit="openEdit(task)" @delete="onDelete(task)" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div v-for="day in 5" :key="day" class="flex flex-col border border-hairline bg-canvas">
        <div class="border-b border-hairline bg-surface-soft p-3">
          <div class="flex items-center justify-between gap-2">
            <p class="text-[12px] font-bold uppercase tracking-wide text-muted">{{ weekdayNames[day] }}</p>
            <button
              v-if="isOwner && editingDay !== day"
              type="button"
              class="text-muted hover:text-ink"
              :aria-label="`Edit ${weekdayNames[day]} theme`"
              @click="editTheme(day)"
            >
              <Pencil :size="14" />
            </button>
          </div>

          <form v-if="editingDay === day" class="mt-2 flex flex-col gap-2" @submit.prevent="submitTheme">
            <p v-if="themeError" class="text-[12px] text-error">{{ themeError }}</p>
            <input v-model="themeForm.theme" type="text" class="text-input !px-3 !py-2 !text-[14px]" placeholder="Theme" />
            <textarea
              v-model="themeForm.example"
              rows="3"
              class="text-input !px-3 !py-2 !text-[13px]"
              placeholder="Example post idea"
            />
            <div class="flex justify-end gap-2">
              <button type="button" class="text-[13px] text-muted hover:text-ink" @click="editingDay = null">Cancel</button>
              <button type="submit" class="bg-primary px-3 py-1.5 text-[13px] font-semibold text-on-primary">Save</button>
            </div>
          </form>
          <template v-else>
            <p class="mt-0.5 font-display text-[15px] font-bold text-ink">{{ themeFor(day)?.theme }}</p>
            <p class="mt-1 text-[12px] text-muted">{{ themeFor(day)?.example }}</p>
          </template>
        </div>

        <div class="flex-1 px-3">
          <div v-for="task in tasksOn(day)" :key="task.id" class="flex items-start gap-2 border-b border-hairline py-2.5 last:border-b-0">
            <RoutineTaskRow :task="task" :link-label="linkLabel(task.link)" :editable="isOwner" @edit="openEdit(task)" @delete="onDelete(task)" />
          </div>
          <p v-if="tasksOn(day).length === 0" class="py-3 text-[13px] text-muted">Only the every-weekday tasks.</p>
        </div>

        <button
          v-if="isOwner"
          type="button"
          class="flex items-center gap-1 border-t border-hairline px-3 py-2 text-[12px] text-muted transition-colors hover:bg-surface-soft hover:text-ink"
          @click="openAdd(day)"
        >
          <Plus :size="14" /> Add routine task
        </button>
      </div>
    </div>

    <RoutineTaskModal ref="modalRef" v-model="showModal" :task="editingTask" :weekday="modalWeekday" @submit="onSubmit" />
  </div>
</template>
