<script setup lang="ts">
import { playbookSectionMeta, type PlaybookField, type PlaybookItem, type PlaybookSection } from '~/data/marketing'
import type { PlaybookInput } from '~/composables/useMarketing'

const props = defineProps<{ modelValue: boolean; section: PlaybookSection; item: PlaybookItem | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [input: PlaybookInput] }>()

const meta = computed(() => playbookSectionMeta[props.section])
const values = reactive<Partial<Record<PlaybookField, string>>>({})
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    for (const key of Object.keys(values) as PlaybookField[]) delete values[key]
    for (const { key } of meta.value.fields) {
      if (key === 'title' || key === 'body') values[key] = props.item?.[key] ?? ''
      else if (key === 'ideas') values.ideas = props.item?.details.ideas?.join('\n') ?? ''
      else values[key] = props.item?.details[key] ?? ''
    }
    error.value = ''
  },
)

defineExpose({ setError: (message: string) => (error.value = message) })

function submit() {
  const { title = '', body = '', ideas = '', ...rest } = values
  const details = Object.fromEntries(Object.entries(rest).map(([key, value]) => [key, value?.trim() ?? '']))
  if (meta.value.fields.some((field) => field.key === 'ideas')) {
    Object.assign(details, { ideas: ideas.split('\n').map((idea) => idea.trim()).filter(Boolean) })
  }
  if (!title.trim() && !body.trim()) {
    error.value = `${meta.value.fields[0]?.label ?? 'This field'} is required.`
    return
  }
  emit('submit', { section: props.section, title: title.trim(), body: body.trim(), details })
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="`${item ? 'Edit' : 'Add to'} ${meta.label}`"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <label v-for="field in meta.fields" :key="field.key" class="flex flex-col gap-1 text-[13px] text-muted">
        {{ field.label }}
        <textarea
          v-if="field.multiline"
          v-model="values[field.key]"
          :rows="field.key === 'ideas' ? 5 : 3"
          class="text-input"
        />
        <input v-else v-model="values[field.key]" type="text" class="text-input" />
      </label>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ item ? 'Save' : 'Add' }}</button>
    </template>
  </AdminModal>
</template>
