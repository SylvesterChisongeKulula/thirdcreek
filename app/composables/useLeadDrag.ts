import type { Lead, LeadStage } from '~/data/crm-leads'

interface DragGhost {
  x: number
  y: number
  name: string
  value: number
}

export function useLeadDrag() {
  const draggingLeadId = useState<string | null>('lead-drag-id', () => null)
  const overStage = useState<LeadStage | null>('lead-drag-over-stage', () => null)
  const ghost = useState<DragGhost | null>('lead-drag-ghost', () => null)

  function startDrag(lead: Lead, x: number, y: number) {
    draggingLeadId.value = lead.id
    ghost.value = { x, y, name: lead.name, value: lead.estimatedValue }
  }

  function updateGhost(x: number, y: number) {
    if (ghost.value) {
      ghost.value.x = x
      ghost.value.y = y
    }
  }

  function setOverStage(stage: LeadStage | null) {
    overStage.value = stage
  }

  function endDrag() {
    draggingLeadId.value = null
    overStage.value = null
    ghost.value = null
  }

  return { draggingLeadId, overStage, ghost, startDrag, updateGhost, setOverStage, endDrag }
}
