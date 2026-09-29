<script setup lang="ts">
import { Phone, MessageCircle, Mail, MapPin } from '@lucide/vue'

definePageMeta({ layout: 'admin', title: 'Contact Profile' })

const { contactsState, leadsState } = useCrmData()

const route = useRoute()
const contact = computed(() => contactsState.value.find((c) => c.id === route.params.id))

const openLeads = computed(() =>
  contact.value
    ? leadsState.value.filter(
        (lead) => lead.contactId === contact.value!.id && lead.stage !== 'Won' && lead.stage !== 'Lost',
      )
    : [],
)

const currency = (value: number) =>
  new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(value)

useHead({ title: () => (contact.value ? `${contact.value.name} — Admin` : 'Contact Not Found') })
</script>

<template>
  <div v-if="contact" class="flex flex-col gap-6">
    <NuxtLink to="/admin/contacts" class="text-link-cta">← Back to Contacts</NuxtLink>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div class="crm-panel flex flex-col gap-5 lg:col-span-1">
        <div>
          <p class="font-display text-xl font-bold text-ink">{{ contact.name }}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            <span v-for="tag in contact.tags" :key="tag" class="bg-surface-strong px-2 py-1 text-[11px] text-ink">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2 text-[14px] text-body">
          <div class="flex items-center gap-2"><Phone :size="16" class="text-muted" />{{ contact.phone }}</div>
          <a
            :href="`https://wa.me/${contact.whatsapp}`"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 hover:text-primary"
          >
            <MessageCircle :size="16" class="text-muted" />WhatsApp
          </a>
          <div class="flex items-center gap-2"><Mail :size="16" class="text-muted" />{{ contact.email }}</div>
          <div class="flex items-center gap-2"><MapPin :size="16" class="text-muted" />{{ contact.location }}</div>
        </div>

        <div>
          <p class="label-uppercase text-muted mb-2">Vehicle Brands</p>
          <p class="text-[14px] text-body">{{ contact.vehicleBrands.join(', ') }}</p>
        </div>

        <div>
          <p class="label-uppercase text-muted mb-2">Open Leads</p>
          <div v-if="openLeads.length" class="flex flex-col gap-2">
            <NuxtLink
              v-for="lead in openLeads"
              :key="lead.id"
              to="/admin/pipeline"
              class="block border border-hairline p-2 text-[13px] transition-colors hover:border-ink"
            >
              <p class="font-semibold text-ink">{{ lead.partsNeeded }}</p>
              <p class="text-muted">{{ lead.stage }} · {{ currency(lead.estimatedValue) }}</p>
            </NuxtLink>
          </div>
          <p v-else class="text-[13px] text-muted">No open leads.</p>
        </div>
      </div>

      <div class="flex flex-col gap-6 lg:col-span-2">
        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-4">Purchase History</p>
          <table v-if="contact.purchaseHistory.length" class="w-full text-left text-[14px]">
            <thead>
              <tr class="border-b border-hairline text-[12px] text-muted">
                <th class="pb-2 font-normal">Date</th>
                <th class="pb-2 font-normal">Item</th>
                <th class="pb-2 font-normal">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(record, index) in contact.purchaseHistory"
                :key="index"
                class="border-b border-hairline last:border-b-0"
              >
                <td class="py-2 text-muted">{{ record.date }}</td>
                <td class="py-2 text-ink">{{ record.item }}</td>
                <td class="py-2 font-semibold text-ink">{{ currency(record.amount) }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-[13px] text-muted">No purchase history recorded yet.</p>
        </div>

        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-2">Notes</p>
          <ActivityItem
            v-for="(note, index) in contact.notes"
            :key="index"
            :date="note.date"
            :author="note.author"
            :text="note.text"
          />
          <p v-if="contact.notes.length === 0" class="text-[13px] text-muted">No notes yet.</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="crm-panel text-center">
    <p class="text-[14px] text-muted">Contact not found.</p>
    <NuxtLink to="/admin/contacts" class="text-link-cta mt-3 inline-flex">← Back to Contacts</NuxtLink>
  </div>
</template>
