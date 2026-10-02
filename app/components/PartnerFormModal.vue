<script setup lang="ts">
import { partnerModels, partnerStatuses, partnerTypes, type MarketingPartner } from '~/data/marketing'
import type { PartnerFormInput } from '~/composables/useMarketing'

const props = defineProps<{ modelValue: boolean; partner: MarketingPartner | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [input: PartnerFormInput] }>()

const blank = (): PartnerFormInput => ({
  name: '',
  facebookUrl: '',
  followers: 0,
  partnerType: 'Mechanic',
  model: 'Affiliate',
  referralCode: '',
  status: 'Prospect',
  notes: '',
})

const form = reactive<PartnerFormInput>(blank())
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    const { id, createdAt, updatedAt, ...existing } = props.partner ?? { ...blank(), id: '', createdAt: '', updatedAt: '' }
    Object.assign(form, existing, { referralCode: existing.referralCode ?? '' })
    error.value = ''
  },
)

defineExpose({ setError: (message: string) => (error.value = message) })

function submit() {
  if (!form.name.trim()) {
    error.value = 'A name is required.'
    return
  }
  emit('submit', { ...form, referralCode: form.referralCode?.trim() || null })
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="partner ? 'Edit Partner' : 'Add Partner'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>
      <input v-model="form.name" type="text" placeholder="Name (person or business)" class="text-input" />
      <input v-model="form.facebookUrl" type="url" placeholder="Facebook page link" class="text-input" />
      <label class="flex flex-col gap-1 text-[13px] text-muted">
        Facebook followers
        <input v-model.number="form.followers" type="number" min="0" class="text-input" />
      </label>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <select v-model="form.partnerType" class="text-input" aria-label="Partner type">
          <option v-for="type in partnerTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <select v-model="form.model" class="text-input" aria-label="Partnership model">
          <option v-for="model in partnerModels" :key="model" :value="model">{{ model }}</option>
        </select>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <input v-model="form.referralCode" type="text" placeholder="Referral code (e.g. TC-JOHN)" class="text-input uppercase" />
        <select v-model="form.status" class="text-input" aria-label="Status">
          <option v-for="status in partnerStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <textarea v-model="form.notes" rows="3" placeholder="Notes: what was agreed, contact details, next step" class="text-input" />
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="emit('update:modelValue', false)">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ partner ? 'Save' : 'Add Partner' }}</button>
    </template>
  </AdminModal>
</template>
