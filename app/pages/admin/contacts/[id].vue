<script setup lang="ts">
import { Phone, MessageCircle, Mail, MapPin, Pencil, Trash2 } from '@lucide/vue'

definePageMeta({ layout: 'admin', title: 'Contact Profile' })

const { contactsState, leadsState, deleteContact, addContactNote } = useCrmData()
const { user } = useAuth()
const toast = useToast()

const route = useRoute()
const contact = computed(() => contactsState.value.find((c) => c.id === route.params.id))
const isOwner = computed(() => user.value?.authRole === 'owner')

const isOpen = (stage: string) => stage !== 'Won' && stage !== 'Lost'

const contactLeads = computed(() =>
  contact.value
    ? leadsState.value
        .filter((lead) => lead.contactId === contact.value!.id)
        .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
    : [],
)
const openLeads = computed(() => contactLeads.value.filter((lead) => isOpen(lead.stage)))

const currency = (value: number) =>
  new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(value)

const stageClasses: Record<string, string> = {
  Won: 'bg-success/15 text-ink',
  Lost: 'bg-error/10 text-error',
}

const showEdit = ref(false)

async function onDelete() {
  if (!contact.value) return
  if (!confirm(`Delete ${contact.value.name}? Their notes are removed; their leads stay in the pipeline.`)) return
  try {
    await deleteContact(contact.value.id)
    await navigateTo('/admin/contacts')
  } catch (error) {
    toast.show(apiErrorMessage(error))
  }
}

const noteText = ref('')
const savingNote = ref(false)

async function submitNote() {
  if (!contact.value || !noteText.value.trim()) return
  savingNote.value = true
  try {
    await addContactNote(contact.value.id, noteText.value.trim())
    noteText.value = ''
  } catch (error) {
    toast.show(apiErrorMessage(error))
  } finally {
    savingNote.value = false
  }
}

const sortedNotes = computed(() => [...(contact.value?.notes ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1)))

useHead({ title: () => (contact.value ? `${contact.value.name} — Admin` : 'Contact Not Found') })
</script>

<template>
  <div v-if="contact" class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <NuxtLink to="/admin/contacts" class="text-link-cta">← Back to Contacts</NuxtLink>
      <div class="flex gap-2">
        <button type="button" class="filter-chip inline-flex items-center gap-2" @click="showEdit = true">
          <Pencil :size="14" /> Edit
        </button>
        <button
          v-if="isOwner"
          type="button"
          class="filter-chip inline-flex items-center gap-2 !text-error hover:!border-error"
          @click="onDelete"
        >
          <Trash2 :size="14" /> Delete
        </button>
      </div>
    </div>

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
          <a :href="`tel:${contact.phone}`" class="flex items-center gap-2 hover:text-primary">
            <Phone :size="16" class="text-muted" />{{ contact.phone }}
          </a>
          <a
            :href="whatsappLink(contact.whatsapp)"
            target="_blank"
            rel="noopener"
            class="flex items-center gap-2 hover:text-primary"
          >
            <MessageCircle :size="16" class="text-muted" />WhatsApp
          </a>
          <a v-if="contact.email" :href="`mailto:${contact.email}`" class="flex items-center gap-2 hover:text-primary">
            <Mail :size="16" class="text-muted" />{{ contact.email }}
          </a>
          <div class="flex items-center gap-2"><MapPin :size="16" class="text-muted" />{{ contact.location }}</div>
        </div>

        <div>
          <p class="label-uppercase text-muted mb-2">Vehicle Brands</p>
          <p class="text-[14px] text-body">{{ contact.vehicleBrands.join(', ') || '—' }}</p>
        </div>

        <div>
          <p class="label-uppercase text-muted mb-2">Open Leads</p>
          <div v-if="openLeads.length" class="flex flex-col gap-2">
            <NuxtLink
              v-for="lead in openLeads"
              :key="lead.id"
              :to="`/admin/pipeline?lead=${lead.id}`"
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
        <div class="crm-panel overflow-x-auto">
          <p class="label-uppercase text-muted mb-4">Lead History</p>
          <table v-if="contactLeads.length" class="w-full min-w-[480px] text-left text-[14px]">
            <thead>
              <tr class="border-b border-hairline text-[12px] text-muted">
                <th class="pb-2 font-normal">Parts / Service</th>
                <th class="pb-2 font-normal">Stage</th>
                <th class="pb-2 text-right font-normal">Estimate</th>
                <th class="pb-2 pl-4 font-normal">Opened</th>
                <th class="pb-2 font-normal">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="lead in contactLeads"
                :key="lead.id"
                class="cursor-pointer border-b border-hairline last:border-b-0 hover:bg-surface-soft"
                @click="navigateTo(`/admin/pipeline?lead=${lead.id}`)"
              >
                <td class="py-2 text-ink">{{ lead.partsNeeded }}</td>
                <td class="py-2">
                  <span class="px-1.5 py-0.5 text-[11px] font-semibold" :class="stageClasses[lead.stage] ?? 'bg-primary/10 text-primary'">
                    {{ lead.stage }}
                  </span>
                </td>
                <td class="py-2 text-right text-ink">{{ currency(lead.estimatedValue) }}</td>
                <td class="py-2 pl-4 text-muted">{{ lead.createdAt }}</td>
                <td class="py-2 text-muted">{{ lead.lastUpdated }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="text-[13px] text-muted">No leads linked to this contact yet.</p>
        </div>

        <div class="crm-panel">
          <p class="label-uppercase text-muted mb-3">Notes</p>
          <form class="mb-2 flex flex-col gap-2 sm:flex-row" @submit.prevent="submitNote">
            <input v-model="noteText" type="text" placeholder="Add a note: a call, a visit, what they asked for…" class="text-input flex-1 !py-2.5" />
            <button type="submit" class="btn-primary !px-5 !py-2.5" :disabled="savingNote || !noteText.trim()">Add Note</button>
          </form>
          <ActivityItem
            v-for="(note, index) in sortedNotes"
            :key="index"
            :date="note.date"
            :author="note.author"
            :text="note.text"
          />
          <p v-if="contact.notes.length === 0" class="pt-2 text-[13px] text-muted">No notes yet.</p>
        </div>
      </div>
    </div>

    <AddContactModal v-model="showEdit" :initial-values="contact" :edit-contact-id="contact.id" />
  </div>

  <div v-else class="crm-panel text-center">
    <p class="text-[14px] text-muted">Contact not found.</p>
    <NuxtLink to="/admin/contacts" class="text-link-cta mt-3 inline-flex">← Back to Contacts</NuxtLink>
  </div>
</template>
