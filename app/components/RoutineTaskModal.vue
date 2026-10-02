<script setup lang="ts">
import { taskCategories, taskLinkOptions, weekdayNames, type RoutineTaskDef } from '~/data/marketing'
import type { RoutineInput } from '~/composables/useMarketing'

const props = defineProps<{ modelValue: boolean; task: RoutineTaskDef | null; weekday: number | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [input: RoutineInput] }>()

const form = reactive<RoutineInput>({ weekday: null, title: '', category: 'Content', link: null })
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    const task = props.task
    Object.assign(form, {
      weekday: task ? task.weekday : props.weekday,
      title: task?.title ?? '',
      category: task?.category ?? 'Content',
      link: task?.link ?? null,
    })
    error.value = ''
  },
)

defineExpose({ setError: (message: string) => (error.value = message) })

function submit() {
  if (!form.title.trim()) {
    error.value = 'Describe the task.'
    return
  }
  emit('submit', { ...form, title: form.title.trim() })
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="task ? 'Edit Routine Task' : 'Add Routine Task'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Task
        <input v-model="form.title" type="text" placeholder="e.g. Reach out to one potential partner" class="text-input" />
        <span class="text-[12px]">Tip: write <code>{theme}</code> to insert that day's posting theme.</span>
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Day
        <select v-model="form.weekday" class="text-input">
          <option :value="null">Every weekday</option>
          <option v-for="day in 5" :key="day" :value="day">{{ weekdayNames[day] }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Category
        <select v-model="form.category" class="text-input">
          <option v-for="category in taskCategories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Link to page (optional)
        <select v-model="form.link" class="text-input">
          <option :value="null">No link</option>
          <option v-for="option in taskLinkOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
      </label>
      <p class="text-[12px] text-muted">Changes apply from today onwards; past and ticked-off tasks are kept as they were.</p>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ task ? 'Save' : 'Add Task' }}</button>
    </template>
  </AdminModal>
</template>
