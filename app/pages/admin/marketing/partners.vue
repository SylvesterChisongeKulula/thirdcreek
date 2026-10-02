<script setup lang="ts">
import { Plus, ExternalLink } from '@lucide/vue'
import { partnerStatuses, type MarketingPartner, type PartnerStatus } from '~/data/marketing'
import type { PartnerFormInput } from '~/composables/useMarketing'

definePageMeta({ title: 'Marketing Partners' })

const { partnersState, addPartner, updatePartner, deletePartner } = useMarketingPartners()
const { leadsState } = useCrmData()
const { user } = useAuth()

const isOwner = computed(() => user.value?.authRole === 'owner')

const statusFilter = ref<PartnerStatus | 'All'>('All')
const statusCounts = computed(() =>
  partnerStatuses.map((status) => ({
    status,
    count: partnersState.value.filter((partner) => partner.status === status).length,
  })),
)

const rows = computed(() =>
  partnersState.value
    .filter((partner) => statusFilter.value === 'All' || partner.status === statusFilter.value)
    .map((partner) => {
      const referred = leadsState.value.filter((lead) => lead.partnerId === partner.id)
      return { ...partner, referred: referred.length, won: referred.filter((lead) => lead.stage === 'Won').length }
    }),
)

const showForm = ref(false)
const editing = ref<MarketingPartner | null>(null)
const formRef = ref<{ setError: (message: string) => void } | null>(null)

function openAdd() {
  editing.value = null
  showForm.value = true
}

function openEdit(partner: MarketingPartner) {
  editing.value = partner
  showForm.value = true
}

async function onSubmit(input: PartnerFormInput) {
  try {
    if (editing.value) await updatePartner(editing.value.id, input)
    else await addPartner(input)
    showForm.value = false
  } catch (error) {
    formRef.value?.setError(apiErrorMessage(error))
  }
}

async function onDelete(partner: MarketingPartner) {
  if (!confirm(`Delete "${partner.name}"? Leads they referred will keep their source but lose the link.`)) return
  await deletePartner(partner.id)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip-active': statusFilter === 'All' }"
          @click="statusFilter = 'All'"
        >
          All · {{ partnersState.length }}
        </button>
        <button
          v-for="item in statusCounts"
          :key="item.status"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip-active': statusFilter === item.status }"
          @click="statusFilter = item.status"
        >
          {{ item.status }} · {{ item.count }}
        </button>
      </div>
      <button type="button" class="btn-primary inline-flex items-center gap-2 !px-5 !py-2.5" @click="openAdd">
        <Plus :size="16" /> Add Partner
      </button>
    </div>

    <div class="crm-panel overflow-x-auto">
      <table class="w-full min-w-[860px] text-left text-[14px]">
        <thead>
          <tr class="border-b border-hairline text-[12px] text-muted">
            <th class="pb-3 font-normal">Partner</th>
            <th class="pb-3 font-normal">Model</th>
            <th class="pb-3 text-right font-normal">Followers</th>
            <th class="pb-3 font-normal">Referral Code</th>
            <th class="pb-3 font-normal">Status</th>
            <th class="pb-3 text-right font-normal">Leads</th>
            <th class="pb-3 text-right font-normal">Won</th>
            <th class="pb-3 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="partner in rows" :key="partner.id" class="border-b border-hairline align-top last:border-b-0">
            <td class="py-3 pr-3">
              <div class="flex items-center gap-1.5">
                <span class="font-semibold text-ink">{{ partner.name }}</span>
                <a
                  v-if="partner.facebookUrl"
                  :href="partner.facebookUrl"
                  target="_blank"
                  rel="noopener"
                  class="text-muted hover:text-primary"
                  aria-label="Open Facebook page"
                >
                  <ExternalLink :size="13" />
                </a>
              </div>
              <p class="text-[12px] text-muted">{{ partner.partnerType }}</p>
              <p v-if="partner.notes" class="mt-1 max-w-xs text-[12px] text-body">{{ partner.notes }}</p>
            </td>
            <td class="py-3 pr-3 text-body">{{ partner.model }}</td>
            <td class="py-3 pr-3 text-right text-ink">{{ formatCount(partner.followers) }}</td>
            <td class="py-3 pr-3 font-mono text-[13px] text-ink">{{ partner.referralCode ?? '—' }}</td>
            <td class="py-3 pr-3">
              <select
                :value="partner.status"
                class="px-2 py-1 text-[12px] font-semibold"
                :class="partnerStatusClasses[partner.status]"
                aria-label="Change status"
                @change="updatePartner(partner.id, { status: ($event.target as HTMLSelectElement).value as PartnerStatus })"
              >
                <option v-for="status in partnerStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
            </td>
            <td class="py-3 pr-3 text-right text-ink">{{ partner.referred }}</td>
            <td class="py-3 pr-3 text-right font-semibold text-ink">{{ partner.won }}</td>
            <td class="py-3">
              <div class="flex gap-3">
                <button type="button" class="text-link-cta" @click="openEdit(partner)">Edit</button>
                <button
                  v-if="isOwner"
                  type="button"
                  class="text-[13px] font-bold uppercase tracking-[1.5px] text-error"
                  @click="onDelete(partner)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0" class="py-8 text-center text-[14px] text-muted">
        {{ partnersState.length === 0 ? 'No partners yet. Add the first mechanic or influencer you reach out to.' : 'No partners with this status.' }}
      </p>
    </div>

    <PartnerFormModal ref="formRef" v-model="showForm" :partner="editing" @submit="onSubmit" />
  </div>
</template>
