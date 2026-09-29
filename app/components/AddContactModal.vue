<script setup lang="ts">
import type { Contact, StoreLocation } from '~/data/crm-contacts'
import { brands } from '~/data/products'
import type { Brand } from '~/data/products'

const props = defineProps<{
  modelValue: boolean
  initialValues?: Partial<Contact>
  sourceLeadId?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; created: [contact: Contact] }>()

const { addContact, convertLeadToContact } = useCrmData()
const { user } = useAuth()

const locations: StoreLocation[] = ['Kabwata', 'Chalala', 'Ibex Hill (Meanwood)']

const lockedLocation = computed(() => (user.value?.authRole === 'staff' ? user.value.location : null))

const form = reactive({
  name: '',
  phone: '',
  whatsapp: '',
  email: '',
  location: 'Kabwata' as StoreLocation,
  vehicleBrands: [] as Brand[],
  tags: '',
})

const error = ref('')

function resetForm() {
  form.name = props.initialValues?.name ?? ''
  form.phone = props.initialValues?.phone ?? ''
  form.whatsapp = props.initialValues?.whatsapp ?? ''
  form.email = props.initialValues?.email ?? ''
  form.location = lockedLocation.value ?? props.initialValues?.location ?? 'Kabwata'
  form.vehicleBrands = props.initialValues?.vehicleBrands ? [...props.initialValues.vehicleBrands] : []
  form.tags = props.initialValues?.tags?.join(', ') ?? ''
  error.value = ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) resetForm()
  },
)

function toggleBrand(brand: Brand) {
  const index = form.vehicleBrands.indexOf(brand)
  if (index === -1) {
    form.vehicleBrands.push(brand)
  } else {
    form.vehicleBrands.splice(index, 1)
  }
}

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (!form.name.trim() || !form.phone.trim() || !form.location) {
    error.value = 'Name, phone and location are required.'
    return
  }

  const input = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    whatsapp: form.whatsapp.trim() || form.phone.trim(),
    email: form.email.trim(),
    location: form.location,
    vehicleBrands: form.vehicleBrands,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  }

  try {
    const contact = props.sourceLeadId
      ? await convertLeadToContact(props.sourceLeadId, input)
      : await addContact(input)
    emit('created', contact)
    close()
  } catch {
    error.value = 'Something went wrong — please try again.'
  }
}
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="sourceLeadId ? 'Convert to Contact' : 'Add Contact'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="flex flex-col gap-4">
      <p v-if="error" class="text-[13px] text-error">{{ error }}</p>

      <input v-model="form.name" type="text" placeholder="Full name" class="text-input" />
      <input v-model="form.phone" type="text" placeholder="Phone number" class="text-input" />
      <input v-model="form.whatsapp" type="text" placeholder="WhatsApp number (optional)" class="text-input" />
      <input v-model="form.email" type="email" placeholder="Email (optional)" class="text-input" />

      <select v-model="form.location" class="text-input" :disabled="!!lockedLocation">
        <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
      </select>

      <div>
        <p class="label-uppercase text-muted mb-2">Vehicle Brands</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="brand in brands"
            :key="brand"
            type="button"
            class="filter-chip"
            :class="{ 'filter-chip-active': form.vehicleBrands.includes(brand) }"
            @click="toggleBrand(brand)"
          >
            {{ brand }}
          </button>
        </div>
      </div>

      <input v-model="form.tags" type="text" placeholder="Tags (comma separated)" class="text-input" />
    </div>

    <template #footer>
      <button type="button" class="btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn-primary" @click="submit">{{ sourceLeadId ? 'Convert' : 'Add Contact' }}</button>
    </template>
  </AdminModal>
</template>
