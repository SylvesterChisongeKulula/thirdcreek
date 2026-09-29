<script setup lang="ts">
import type { Lead } from '~/data/crm-leads'
import type { StoreLocation } from '~/data/crm-contacts'
import { brands } from '~/data/products'
import type { Brand } from '~/data/products'
import { staff } from '~/data/crm-staff'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; created: [lead: Lead] }>()

const { addLead, contactsState } = useCrmData()
const { user } = useAuth()

const locations: StoreLocation[] = ['Kabwata', 'Chalala', 'Ibex Hill (Meanwood)']

const lockedLocation = computed(() => (user.value?.authRole === 'staff' ? user.value.location : null))

const form = reactive({
  name: '',
  phone: '',
  location: 'Kabwata' as StoreLocation,
  vehicleBrand: brands[0] as Brand,
  partsNeeded: '',
  estimatedValue: 0,
  assignedTo: staff[0]?.name ?? '',
  contactId: '',
})

const error = ref('')

function resetForm() {
  form.name = ''
  form.phone = ''
  form.location = lockedLocation.value ?? 'Kabwata'
  form.vehicleBrand = brands[0]
  form.partsNeeded = ''
  form.estimatedValue = 0
  form.assignedTo = staff[0]?.name ?? ''
  form.contactId = ''
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

  try {
    const lead = await addLead({
      name: form.name.trim(),
      phone: form.phone.trim(),
      location: form.location,
      vehicleBrand: form.vehicleBrand,
      partsNeeded: form.partsNeeded.trim(),
      estimatedValue: form.estimatedValue,
      assignedTo: form.assignedTo,
      contactId: form.contactId || undefined,
    })

    emit('created', lead)
    close()
  } catch {
    error.value = 'Something went wrong — please try again.'
  }
}
</script>

<template>
  <AdminModal :model-value="modelValue" title="Add Lead" @update:model-value="emit('update:modelValue', $event)">
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>

      <input v-model="form.name" type="text" placeholder="Prospect name" class="text-input" />
      <input v-model="form.phone" type="text" placeholder="Phone number" class="text-input" />

      <select v-model="form.location" class="text-input" :disabled="!!lockedLocation">
        <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
      </select>

      <select v-model="form.vehicleBrand" class="text-input">
        <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
      </select>

      <textarea v-model="form.partsNeeded" placeholder="Parts / service needed" rows="3" class="text-input"></textarea>

      <input v-model.number="form.estimatedValue" type="number" min="0" placeholder="Estimated value (ZMW)" class="text-input" />

      <select v-model="form.assignedTo" class="text-input">
        <option v-for="member in staff" :key="member.name" :value="member.name">{{ member.name }}</option>
      </select>

      <select v-model="form.contactId" class="text-input">
        <option value="">Not yet a contact</option>
        <option v-for="contact in contactsState" :key="contact.id" :value="contact.id">{{ contact.name }}</option>
      </select>
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">Add Lead</button>
    </template>
  </AdminModal>
</template>
