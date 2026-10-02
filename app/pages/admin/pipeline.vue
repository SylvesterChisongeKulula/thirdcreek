<script setup lang="ts">
import { Plus } from '@lucide/vue'
import { leadStages } from '~/data/crm-leads'
import type { Lead, LeadStage } from '~/data/crm-leads'

definePageMeta({ layout: 'admin', title: 'Pipeline' })

const { leadsState, advanceLeadStage, deleteLead } = useCrmData()
const toast = useToast()
const route = useRoute()
const { ghost } = useLeadDrag()

const leadsByStage = (stage: LeadStage) => leadsState.value.filter((lead) => lead.stage === stage)

const showAddLead = ref(false)
const showConvert = ref(false)
const convertingLead = ref<Lead | null>(null)

// Track the selected lead by id so the modal reflects the latest data after a change.
const selectedLeadId = ref<string | null>(null)
const selectedLead = computed(() => leadsState.value.find((lead) => lead.id === selectedLeadId.value) ?? null)
const showDetail = ref(false)

const editingLead = ref<Lead | null>(null)
const showEditLead = ref(false)

const convertInitialValues = computed(() =>
  convertingLead.value
    ? {
        name: convertingLead.value.name,
        phone: convertingLead.value.phone,
        location: convertingLead.value.location,
        vehicleBrands: [convertingLead.value.vehicleBrand],
      }
    : undefined,
)

function openConvert(id: string) {
  const lead = leadsState.value.find((item) => item.id === id)
  if (!lead) return
  convertingLead.value = lead
  showConvert.value = true
}

function openDetail(id: string) {
  if (!leadsState.value.some((item) => item.id === id)) return
  selectedLeadId.value = id
  showDetail.value = true
}

// Links like /admin/pipeline?lead=lead-007 (from contacts and notifications) open that lead.
watch(
  [() => route.query.lead, () => leadsState.value.length],
  ([leadId]) => {
    if (typeof leadId === 'string' && leadId !== selectedLeadId.value) openDetail(leadId)
  },
  { immediate: true },
)

watch(showDetail, (open) => {
  if (!open && route.query.lead) navigateTo({ query: { ...route.query, lead: undefined } }, { replace: true })
})

function handleEdit(lead: Lead) {
  showDetail.value = false
  editingLead.value = lead
  showEditLead.value = true
}

async function handleDelete(lead: Lead) {
  if (!confirm(`Delete the lead for ${lead.name}? This can't be undone.`)) return
  try {
    await deleteLead(lead.id)
    showDetail.value = false
  } catch (error) {
    toast.show(apiErrorMessage(error))
  }
}

function handleConvertFromDetail(id: string) {
  showDetail.value = false
  openConvert(id)
}

const ghostValue = computed(() =>
  ghost.value
    ? new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(
        ghost.value.value,
      )
    : '',
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <p class="label-uppercase text-muted">Drag a card to change its stage, or tap it for details</p>
      <button type="button" class="btn-primary inline-flex items-center gap-2" @click="showAddLead = true">
        <Plus :size="16" />
        Add Lead
      </button>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-4">
      <KanbanColumn
        v-for="stage in leadStages"
        :key="stage"
        :stage="stage"
        :leads="leadsByStage(stage)"
        @open="openDetail"
        @drop="advanceLeadStage"
      />
    </div>

    <AddLeadModal v-model="showAddLead" />
    <AddContactModal v-model="showConvert" :initial-values="convertInitialValues" :source-lead-id="convertingLead?.id" />
    <LeadDetailModal
      v-model="showDetail"
      :lead="selectedLead"
      @convert="handleConvertFromDetail"
      @change-stage="advanceLeadStage"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <AddLeadModal v-model="showEditLead" :lead="editingLead" />

    <Teleport to="body">
      <div
        v-if="ghost"
        class="pointer-events-none fixed z-50 flex flex-col gap-0.5 border border-ink bg-canvas px-3 py-2 shadow-lg"
        :style="{ left: `${ghost.x + 12}px`, top: `${ghost.y + 12}px` }"
      >
        <p class="font-display text-[13px] font-semibold text-ink">{{ ghost.name }}</p>
        <p class="text-[12px] text-muted">{{ ghostValue }}</p>
      </div>
    </Teleport>
  </div>
</template>
