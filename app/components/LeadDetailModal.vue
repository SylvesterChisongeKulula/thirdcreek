<script setup lang="ts">
import { leadStages } from '~/data/crm-leads'
import type { Lead, LeadStage } from '~/data/crm-leads'

const props = defineProps<{
  modelValue: boolean
  lead: Lead | null
}>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  convert: [id: string]
  'change-stage': [id: string, stage: LeadStage]
}>()

const formattedValue = computed(() =>
  props.lead
    ? new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(
        props.lead.estimatedValue,
      )
    : '',
)

const nudge = computed(() => (props.lead ? getLeadNudge(props.lead) : null))
</script>

<template>
  <AdminModal
    :model-value="modelValue"
    :title="lead?.name ?? 'Lead Details'"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="lead" class="flex flex-col gap-4">
      <p
        v-if="nudge"
        class="label-uppercase border px-3 py-2 text-[12px]"
        :class="[nudgeToneClasses[nudge.tone], nudgeTextClasses[nudge.tone]]"
      >
        {{ nudge.message }}
      </p>

      <div>
        <NuxtLink
          v-if="lead.contactId"
          :to="`/crm/contacts/${lead.contactId}`"
          class="text-link-cta"
        >
          View Contact →
        </NuxtLink>
        <button v-else type="button" class="btn-primary" @click="$emit('convert', lead.id)">
          Convert to Contact
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 text-[14px]">
        <div>
          <p class="label-uppercase text-muted mb-1">Vehicle Brand</p>
          <p class="text-ink">{{ lead.vehicleBrand }}</p>
        </div>
        <div>
          <p class="label-uppercase text-muted mb-1">Estimated Value</p>
          <p class="font-semibold text-ink">{{ formattedValue }}</p>
        </div>
        <div>
          <p class="label-uppercase text-muted mb-1">Assigned To</p>
          <p class="text-ink">{{ lead.assignedTo }}</p>
        </div>
        <div>
          <p class="label-uppercase text-muted mb-1">Location</p>
          <p class="text-ink">{{ lead.location }}</p>
        </div>
        <div>
          <p class="label-uppercase text-muted mb-1">Created</p>
          <p class="text-ink">{{ lead.createdAt }}</p>
        </div>
        <div>
          <p class="label-uppercase text-muted mb-1">Last Updated</p>
          <p class="text-ink">{{ lead.lastUpdated }}</p>
        </div>
      </div>

      <div>
        <p class="label-uppercase text-muted mb-1">Parts / Service Needed</p>
        <p class="text-[14px] text-body">{{ lead.partsNeeded }}</p>
      </div>

      <div>
        <p class="label-uppercase text-muted mb-2">Stage</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="stage in leadStages"
            :key="stage"
            type="button"
            class="filter-chip"
            :class="{ 'filter-chip-active': stage === lead.stage }"
            :disabled="stage === lead.stage"
            @click="$emit('change-stage', lead.id, stage)"
          >
            {{ stage }}
          </button>
        </div>
      </div>
    </div>
  </AdminModal>
</template>
