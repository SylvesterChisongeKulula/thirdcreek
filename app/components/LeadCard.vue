<script setup lang="ts">
import type { Lead, LeadStage } from '~/data/crm-leads'

const props = defineProps<{ lead: Lead }>()
const emit = defineEmits<{
  open: [id: string]
  drop: [id: string, stage: LeadStage]
}>()

const { draggingLeadId, overStage, startDrag, updateGhost, setOverStage, endDrag } = useLeadDrag()

const cardRef = ref<HTMLElement | null>(null)
const origin = { x: 0, y: 0 }
let activePointerId: number | null = null

const THRESHOLD = 7

const isDraggingSelf = computed(() => draggingLeadId.value === props.lead.id)

function onPointerDown(e: PointerEvent) {
  if (activePointerId !== null) return
  activePointerId = e.pointerId
  origin.x = e.clientX
  origin.y = e.clientY
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return

  if (!isDraggingSelf.value) {
    const dx = e.clientX - origin.x
    const dy = e.clientY - origin.y
    if (Math.hypot(dx, dy) < THRESHOLD) return
    cardRef.value?.setPointerCapture(e.pointerId)
    startDrag(props.lead, e.clientX, e.clientY)
  }

  e.preventDefault()
  updateGhost(e.clientX, e.clientY)
  const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>('[data-drop-stage]')
  setOverStage((target?.dataset.dropStage as LeadStage | undefined) ?? null)
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return
  activePointerId = null

  if (isDraggingSelf.value) {
    const finalStage = overStage.value
    endDrag()
    if (finalStage && finalStage !== props.lead.stage) {
      emit('drop', props.lead.id, finalStage)
    }
  } else {
    emit('open', props.lead.id)
  }
}

function onPointerCancel(e: PointerEvent) {
  if (e.pointerId !== activePointerId) return
  activePointerId = null
  if (isDraggingSelf.value) endDrag()
}

const nudge = computed(() => getLeadNudge(props.lead))

const daysInStage = computed(() => {
  const updated = new Date(props.lead.lastUpdated)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)))
})

const formattedValue = computed(() =>
  new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(
    props.lead.estimatedValue,
  ),
)
</script>

<template>
  <div
    ref="cardRef"
    class="flex touch-pan-y select-none flex-col gap-2 border p-4 transition-opacity"
    :class="[
      isDraggingSelf ? 'cursor-grabbing opacity-40' : 'cursor-grab',
      nudge ? nudgeToneClasses[nudge.tone] : 'border-hairline bg-canvas',
    ]"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
  >
    <div class="flex items-start justify-between gap-2">
      <p class="font-display font-semibold text-[14px] text-ink">{{ lead.name }}</p>
      <span class="label-uppercase shrink-0 text-[11px] text-muted">{{ lead.vehicleBrand }}</span>
    </div>

    <p class="text-[13px] text-body">{{ lead.partsNeeded }}</p>

    <div class="mt-1 flex items-center justify-between text-[13px]">
      <span class="font-semibold text-ink">{{ formattedValue }}</span>
      <span class="text-muted">{{ daysInStage }}d in stage</span>
    </div>

    <div class="flex items-center justify-between text-[12px] text-muted">
      <span>{{ lead.assignedTo }}</span>
      <span>{{ lead.location }}</span>
    </div>

    <p v-if="nudge" class="label-uppercase text-[11px]" :class="nudgeTextClasses[nudge.tone]">{{ nudge.message }}</p>
  </div>
</template>
