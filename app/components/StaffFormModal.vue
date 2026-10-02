<script setup lang="ts">
import { storeLocations, type StoreLocation } from '~/data/crm-contacts'
import type { StaffAccount, StaffAccountInput } from '~/data/crm-staff'

const props = defineProps<{ modelValue: boolean; member: StaffAccount | null }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [input: StaffAccountInput & { name: string; password: string }]
}>()

const form = reactive({
  name: '',
  role: '',
  location: storeLocations[0] as StoreLocation,
  authRole: 'staff' as 'owner' | 'staff',
  password: '',
})
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    const member = props.member
    Object.assign(form, {
      name: member?.name ?? '',
      role: member?.role ?? '',
      location: member?.location ?? storeLocations[0],
      authRole: member?.authRole ?? 'staff',
      password: '',
    })
    error.value = ''
  },
)

defineExpose({ setError: (message: string) => (error.value = message) })

function submit() {
  if (!form.name.trim() || !form.role.trim()) {
    error.value = 'Name and role are required.'
    return
  }
  if (!props.member && form.password.length < 8) {
    error.value = 'Set a starting password of at least 8 characters.'
    return
  }
  emit('submit', { ...form, name: form.name.trim(), role: form.role.trim() })
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="member ? `Edit ${member.name}` : 'Add Staff Member'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Full name
        <input v-model="form.name" type="text" class="text-input" :disabled="!!member" />
        <span v-if="member" class="text-[12px]">Names can't be changed because leads are assigned by name.</span>
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Role
        <input v-model="form.role" type="text" placeholder="e.g. Sales Executive" class="text-input" />
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Branch
        <select v-model="form.location" class="text-input">
          <option v-for="location in storeLocations" :key="location" :value="location">{{ location }}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Access
        <select v-model="form.authRole" class="text-input">
          <option value="staff">Staff — sees and works on their own branch</option>
          <option value="owner">Owner — sees all branches and manages settings</option>
        </select>
      </label>
      <label v-if="!member" class="flex flex-col gap-1 text-[13px] text-muted">
        Starting password
        <input v-model="form.password" type="password" autocomplete="new-password" class="text-input" />
        <span class="text-[12px]">Share it with them privately; they can change it after logging in.</span>
      </label>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ member ? 'Save' : 'Add Staff Member' }}</button>
    </template>
  </AdminModal>
</template>
