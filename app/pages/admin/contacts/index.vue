<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { storeLocations, type Contact, type StoreLocation } from '~/data/crm-contacts'
import { brands } from '~/data/products'
import type { Brand } from '~/data/products'

definePageMeta({ layout: 'admin', title: 'Contacts' })

const { contactsState, leadsState } = useCrmData()

const searchQuery = ref('')
const selectedLocation = ref<StoreLocation | 'All'>('All')
const selectedBrand = ref<Brand | 'All'>('All')
const showAddContact = ref(false)

const locations: (StoreLocation | 'All')[] = ['All', ...storeLocations]

const { user } = useAuth()
// Staff only see their own branch's contacts, so the branch filter is owner-only.
const showBranchFilter = computed(() => user.value?.authRole !== 'staff')

const filteredContacts = computed(() =>
  contactsState.value.filter((contact) => {
    const matchesSearch =
      !searchQuery.value ||
      contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      contact.phone.includes(searchQuery.value)
    const matchesLocation = selectedLocation.value === 'All' || contact.location === selectedLocation.value
    const matchesBrand = selectedBrand.value === 'All' || contact.vehicleBrands.includes(selectedBrand.value)
    return matchesSearch && matchesLocation && matchesBrand
  }),
)

const lastInteraction = (contact: Contact) => {
  const dates = [
    contact.createdAt,
    ...contact.notes.map((note) => note.date),
    ...leadsState.value.filter((lead) => lead.contactId === contact.id).map((lead) => lead.lastUpdated),
  ]
  return dates.sort().at(-1)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <input v-model="searchQuery" type="search" placeholder="Search by name or phone..." class="text-input max-w-sm" />
      <button type="button" class="btn-primary inline-flex items-center gap-2" @click="showAddContact = true">
        <Plus :size="16" />
        Add Contact
      </button>
    </div>

    <div v-if="showBranchFilter" class="flex flex-wrap gap-2">
      <button
        v-for="location in locations"
        :key="location"
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip-active': selectedLocation === location }"
        @click="selectedLocation = location"
      >
        {{ location }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip-active': selectedBrand === 'All' }"
        @click="selectedBrand = 'All'"
      >
        All Brands
      </button>
      <button
        v-for="brand in brands"
        :key="brand"
        type="button"
        class="filter-chip"
        :class="{ 'filter-chip-active': selectedBrand === brand }"
        @click="selectedBrand = brand"
      >
        {{ brand }}
      </button>
    </div>

    <div class="crm-panel overflow-x-auto">
      <table class="w-full min-w-[720px] text-left text-[14px]">
        <thead>
          <tr class="border-b border-hairline text-[12px] text-muted">
            <th class="pb-3 font-normal">Name</th>
            <th class="pb-3 font-normal">Phone</th>
            <th class="pb-3 font-normal">Location</th>
            <th class="pb-3 font-normal">Vehicle Brands</th>
            <th class="pb-3 font-normal">Last Interaction</th>
            <th class="pb-3 font-normal">Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="cursor-pointer border-b border-hairline last:border-b-0 hover:bg-surface-soft"
            @click="navigateTo(`/admin/contacts/${contact.id}`)"
          >
            <td class="py-3 font-semibold text-ink">{{ contact.name }}</td>
            <td class="py-3 text-body">{{ contact.phone }}</td>
            <td class="py-3 text-body">{{ contact.location }}</td>
            <td class="py-3 text-body">{{ contact.vehicleBrands.join(', ') }}</td>
            <td class="py-3 text-muted">{{ lastInteraction(contact) }}</td>
            <td class="py-3">
              <span
                v-for="tag in contact.tags"
                :key="tag"
                class="mr-1 inline-block bg-surface-strong px-2 py-1 text-[11px] text-ink"
              >
                {{ tag }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="filteredContacts.length === 0" class="py-8 text-center text-[14px] text-muted">
        No contacts match your filters.
      </p>
    </div>

    <AddContactModal v-model="showAddContact" />
  </div>
</template>
