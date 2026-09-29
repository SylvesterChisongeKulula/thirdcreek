<script setup lang="ts">
import type { Lead, LeadStage } from '~/data/crm-leads'

const props = defineProps<{
  stage: LeadStage
  leads: Lead[]
}>()
defineEmits<{
  open: [id: string]
  drop: [id: string, stage: LeadStage]
}>()

const { draggingLeadId, overStage } = useLeadDrag()

const isDropTarget = computed(() => !!draggingLeadId.value && overStage.value === props.stage)
</script>

<template>
  <div class="flex w-72 shrink-0 flex-col border border-hairline bg-surface-soft">
    <div class="flex items-center justify-between border-b border-hairline-strong px-4 py-3">
      <p class="label-uppercase text-ink">{{ stage }}</p>
      <span class="text-[12px] text-muted">{{ leads.length }}</span>
    </div>
    <div
      class="flex flex-col gap-3 overflow-y-auto p-3 transition-colors"
      :class="isDropTarget ? 'border-2 border-dashed border-ink bg-primary/5' : 'border-2 border-transparent'"
      :data-drop-stage="stage"
    >
      <LeadCard
        v-for="lead in leads"
        :key="lead.id"
        :lead="lead"
        @open="$emit('open', $event)"
        @drop="(id, targetStage) => $emit('drop', id, targetStage)"
      />
      <p v-if="leads.length === 0" class="py-6 text-center text-[13px] text-muted">No leads</p>
    </div>
  </div>
</template>
