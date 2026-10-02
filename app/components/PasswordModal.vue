<script setup lang="ts">
// Two modes: an owner setting someone's password (no current password), or a user changing their own.
const props = defineProps<{ modelValue: boolean; title: string; requireCurrent?: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [input: { current: string; next: string }]
}>()

const MIN_LENGTH = 8
const form = reactive({ current: '', next: '', confirm: '' })
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    Object.assign(form, { current: '', next: '', confirm: '' })
    error.value = ''
  },
)

defineExpose({ setError: (message: string) => (error.value = message) })

function submit() {
  if (props.requireCurrent && !form.current) {
    error.value = 'Enter your current password.'
    return
  }
  if (form.next.length < MIN_LENGTH) {
    error.value = `Passwords must be at least ${MIN_LENGTH} characters.`
    return
  }
  if (form.next !== form.confirm) {
    error.value = "The new passwords don't match."
    return
  }
  emit('submit', { current: form.current, next: form.next })
}
</script>

<template>
  <AdminModal :model-value="modelValue" :title="title" @update:model-value="emit('update:modelValue', $event)">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <input
        v-if="requireCurrent"
        v-model="form.current"
        type="password"
        placeholder="Current password"
        autocomplete="current-password"
        class="text-input"
      />
      <input v-model="form.next" type="password" placeholder="New password" autocomplete="new-password" class="text-input" />
      <input
        v-model="form.confirm"
        type="password"
        placeholder="Confirm new password"
        autocomplete="new-password"
        class="text-input"
      />
      <button type="submit" class="hidden" />
    </form>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">Save Password</button>
    </template>
  </AdminModal>
</template>
