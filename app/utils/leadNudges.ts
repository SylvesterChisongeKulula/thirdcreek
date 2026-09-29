import type { Lead } from '~/data/crm-leads'

export interface LeadNudge {
  message: string
  tone: 'warning' | 'primary' | 'success' | 'error'
}

export const nudgeToneClasses: Record<LeadNudge['tone'], string> = {
  warning: 'bg-warning/10 border-warning/40',
  primary: 'bg-primary/5 border-primary/30',
  success: 'bg-success/10 border-success/40',
  error: 'bg-error/10 border-error/40',
}

export const nudgeTextClasses: Record<LeadNudge['tone'], string> = {
  warning: 'text-warning',
  primary: 'text-primary',
  success: 'text-success',
  error: 'text-error',
}

export function getLeadNudge(lead: Lead, now = new Date()): LeadNudge | null {
  const days = Math.floor((now.getTime() - new Date(lead.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))

  switch (lead.stage) {
    case 'New Lead':
      return days >= 1 ? { message: 'Needs first contact', tone: 'warning' } : null
    case 'Quoted':
      return days >= 3 ? { message: 'Follow up on quotation', tone: 'primary' } : null
    case 'Won':
      return days >= 7 ? { message: 'Courtesy check-in', tone: 'success' } : null
    case 'Lost':
      return days >= 30 ? { message: 'Reach out again', tone: 'error' } : null
    default:
      return null
  }
}
