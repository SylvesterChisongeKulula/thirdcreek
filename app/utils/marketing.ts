import type { Lead, LeadStage } from '~/data/crm-leads'
import { socialLeadSources, type PartnerStatus, type TaskCategory } from '~/data/marketing'

export const taskCategoryClasses: Record<TaskCategory, string> = {
  Content: 'bg-primary/10 text-primary',
  Engagement: 'bg-success/15 text-ink',
  Partners: 'bg-warning/15 text-ink',
  Review: 'bg-surface-strong text-ink',
}

export const partnerStatusClasses: Record<PartnerStatus, string> = {
  Prospect: 'bg-surface-strong text-ink',
  Contacted: 'bg-primary/10 text-primary',
  Trial: 'bg-warning/15 text-ink',
  Active: 'bg-success/15 text-ink',
  Ended: 'bg-error/10 text-error',
}

export const formatCount = (value: number) => new Intl.NumberFormat('en-ZM').format(value)

export const percent = (part: number, whole: number) => (whole === 0 ? 0 : Math.round((part / whole) * 100))

const engagedStages: LeadStage[] = ['Contacted', 'Quoted', 'Won']

export const isSocialLead = (lead: Lead) => socialLeadSources.includes(lead.source)

// Lead → engaged (we've spoken / quoted) → client (won). Lost leads count as leads only, since the
// pipeline keeps a lead's current stage rather than its history.
export function leadFunnel(leads: Lead[]) {
  const engaged = leads.filter((lead) => engagedStages.includes(lead.stage)).length
  const clients = leads.filter((lead) => lead.stage === 'Won').length
  return {
    leads: leads.length,
    engaged,
    clients,
    lost: leads.filter((lead) => lead.stage === 'Lost').length,
    engagedRate: percent(engaged, leads.length),
    clientRate: percent(clients, engaged),
    conversionRate: percent(clients, leads.length),
  }
}
