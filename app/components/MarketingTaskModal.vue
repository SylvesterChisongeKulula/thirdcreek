<script setup lang="ts">
import { isWeekend, taskCategories, type TaskCategory } from '~/data/marketing'

const props = defineProps<{ modelValue: boolean; date: string }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [input: { date: string; title: string; category: TaskCategory; assignedTo: string | null }]
}>()

const { staffState } = useStaff()

const form = reactive({ date: '', title: '', category: 'Content' as TaskCategory, assignedTo: '' })
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    Object.assign(form, { date: props.date, title: '', category: 'Content', assignedTo: '' })
    error.value = ''
  },
)

function submit() {
  if (!form.title.trim() || !form.date) {
    error.value = 'A date and a task description are required.'
    return
  }
  if (isWeekend(form.date)) {
    error.value = 'The marketing calendar runs Monday to Friday — pick a weekday.'
    return
  }
  emit('submit', { date: form.date, title: form.title.trim(), category: form.category, assignedTo: form.assignedTo || null })
}
</script>

<template>
  <AdminModal :model-value="modelValue" title="Add Task" @update:model-value="emit('update:modelValue', $event)">
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <input v-model="form.title" type="text" placeholder="What needs to be done?" class="text-input" />
      <input v-model="form.date" type="date" class="text-input" />
      <select v-model="form.category" class="text-input">
        <option v-for="category in taskCategories" :key="category" :value="category">{{ category }}</option>
      </select>
      <select v-model="form.assignedTo" class="text-input">
        <option value="">Anyone</option>
        <option v-for="member in staffState" :key="member.name" :value="member.name">{{ member.name }}</option>
      </select>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">Add Task</button>
    </template>
  </AdminModal>
</template>
