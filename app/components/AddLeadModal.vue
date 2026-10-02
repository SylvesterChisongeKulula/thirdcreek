<script setup lang="ts">
import type { Lead } from '~/data/crm-leads'
import { storeLocations, type StoreLocation } from '~/data/crm-contacts'
import { brands } from '~/data/products'
import type { Brand } from '~/data/products'
import { leadSources, type LeadSource } from '~/data/marketing'

// Pass `lead` to edit an existing lead instead of creating one.
const props = defineProps<{ modelValue: boolean; lead?: Lead | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; created: [lead: Lead]; saved: [lead: Lead] }>()

const { addLead, updateLead, contactsState } = useCrmData()
const { user } = useAuth()
const { partnersState } = useMarketingPartners()
const { staffState } = useStaff()

const referralPartners = computed(() => partnersState.value.filter((partner) => partner.status !== 'Ended'))

const lockedLocation = computed(() => (user.value?.authRole === 'staff' ? user.value.location : null))

const form = reactive({
  name: '',
  phone: '',
  location: 'Kabwata' as StoreLocation,
  vehicleBrand: brands[0] as Brand,
  partsNeeded: '',
  estimatedValue: 0,
  assignedTo: staffState.value[0]?.name ?? '',
  contactId: '',
  source: 'Facebook' as LeadSource,
  partnerId: '',
})

const error = ref('')

function resetForm() {
  const lead = props.lead
  form.name = lead?.name ?? ''
  form.phone = lead?.phone ?? ''
  form.location = lead?.location ?? lockedLocation.value ?? 'Kabwata'
  form.vehicleBrand = lead?.vehicleBrand ?? brands[0]!
  form.partsNeeded = lead?.partsNeeded ?? ''
  form.estimatedValue = lead?.estimatedValue ?? 0
  form.assignedTo = lead?.assignedTo ?? staffState.value[0]?.name ?? ''
  form.contactId = lead?.contactId ?? ''
  form.source = lead?.source ?? 'Facebook'
  form.partnerId = lead?.partnerId ?? ''
  error.value = ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm()
  },
)

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (!form.name.trim() || !form.phone.trim() || !form.partsNeeded.trim() || !form.assignedTo || form.estimatedValue <= 0) {
    error.value = 'Name, phone, parts needed, staff and a value greater than zero are required.'
    return
  }
  if (form.source === 'Partner referral' && !form.partnerId) {
    error.value = 'Choose which partner referred this lead.'
    return
  }

  try {
    const input = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location,
      vehicleBrand: form.vehicleBrand,
      partsNeeded: form.partsNeeded.trim(),
      estimatedValue: form.estimatedValue,
      assignedTo: form.assignedTo,
      contactId: form.contactId || undefined,
      source: form.source,
      partnerId: form.source === 'Partner referral' ? form.partnerId : null,
    }

    if (props.lead) emit('saved', await updateLead(props.lead.id, input))
    else emit('created', await addLead(input))
    close()
  } catch (err) {
    error.value = apiErrorMessage(err)
  }
}
</script>

<template>
  <AdminModal :model-value="modelValue" :title="lead ? 'Edit Lead' : 'Add Lead'" @update:model-value="emit('update:modelValue', $event)">
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>

      <input v-model="form.name" type="text" placeholder="Prospect name" class="text-input" />
      <input v-model="form.phone" type="text" placeholder="Phone number" class="text-input" />

      <select v-model="form.location" class="text-input" :disabled="!!lockedLocation">
        <option v-for="location in storeLocations" :key="location" :value="location">{{ location }}</option>
      </select>

      <select v-model="form.vehicleBrand" class="text-input">
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>

      <textarea v-model="form.partsNeeded" placeholder="Parts / service needed" rows="3" class="text-input"></textarea>

      <input v-model.number="form.estimatedValue" type="number" min="0" placeholder="Estimated value (ZMW)" class="text-input" />

      <select v-model="form.assignedTo" class="text-input">
        <option v-for="member in staffState" :key="member.name" :value="member.name">{{ member.name }}</option>
      </select>

      <label class="flex flex-col gap-1 text-[13px] text-muted">
        How did they find us?
        <select v-model="form.source" class="text-input">
          <option v-for="source in leadSources" :key="source" :value="source">{{ source }}</option>
        </select>
      </label>

      <select v-if="form.source === 'Partner referral'" v-model="form.partnerId" class="text-input" aria-label="Referring partner">
        <option value="" disabled>Which partner referred them?</option>
        <option v-for="partner in referralPartners" :key="partner.id" :value="partner.id">
          {{ partner.name }}{{ partner.referralCode ? ` (${partner.referralCode})` : '' }}
        </option>
      </select>

      <select v-model="form.contactId" class="text-input">
        <option value="">Not yet a contact</option>
        <option v-for="contact in contactsState" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
      </select>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ lead ? 'Save' : 'Add Lead' }}</button>
    </template>
  </AdminModal>
</template>
