export type LeadSource = 'Facebook' | 'Partner referral' | 'WhatsApp' | 'Walk-in' | 'Phone call' | 'Other'

export const leadSources: LeadSource[] = ['Facebook', 'Partner referral', 'WhatsApp', 'Walk-in', 'Phone call', 'Other']

// Sources that count as "from social media" in the marketing metrics.
export const socialLeadSources: LeadSource[] = ['Facebook', 'Partner referral']

export type PartnerType = 'Mechanic' | 'Influencer' | 'Workshop'
export type PartnerModel = 'Mechanic partnership' | 'Affiliate' | 'Consignment' | 'Brand ambassador'
export type PartnerStatus = 'Prospect' | 'Contacted' | 'Trial' | 'Active' | 'Ended'

export const partnerTypes: PartnerType[] = ['Mechanic', 'Influencer', 'Workshop']
export const partnerModels: PartnerModel[] = ['Mechanic partnership', 'Affiliate', 'Consignment', 'Brand ambassador']
export const partnerStatuses: PartnerStatus[] = ['Prospect', 'Contacted', 'Trial', 'Active', 'Ended']

export interface MarketingPartner {
  id: string
  name: string
  facebookUrl: string
  followers: number
  partnerType: PartnerType
  model: PartnerModel
  referralCode: string | null
  status: PartnerStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export type TaskCategory = 'Content' | 'Engagement' | 'Partners' | 'Review'

export const taskCategories: TaskCategory[] = ['Content', 'Engagement', 'Partners', 'Review']

export interface MarketingTask {
  id: number
  date: string
  title: string
  category: TaskCategory
  routineKey: string | null
  link: string | null
  assignedTo: string | null
  completedBy: string | null
  completedAt: string | null
  createdAt: string
}

export interface EngagementLog {
  id: number
  weekStart: string
  postsPublished: number
  comments: number
  messages: number
  newFollowers: number
  reach: number
  notes: string
  loggedBy: string
  createdAt: string
}

// Local-time ISO date (YYYY-MM-DD), so "today" matches the user's calendar day.
export function toISODate(date: Date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00`)
  next.setDate(next.getDate() + days)
  return toISODate(next)
}

// Monday of the week containing `date`.
export function weekStartOf(date: string) {
  const day = new Date(`${date}T00:00:00`).getDay()
  return addDays(date, -((day + 6) % 7))
}

export const isWeekend = (date: string) => [0, 6].includes(new Date(`${date}T00:00:00`).getDay())

// 1 = Monday … 5 = Friday (0 for weekends), matching marketing_day_themes.weekday.
export const workweekday = (date: string) => {
  const day = new Date(`${date}T00:00:00`).getDay()
  return day === 0 || day === 6 ? 0 : day
}

export const weekdayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

// The marketing week is Monday–Friday. On a weekend, "this week" means the coming one.
export function currentWorkweekStart(today: string) {
  return isWeekend(today) ? addDays(weekStartOf(today), 7) : weekStartOf(today)
}

export function nextWorkday(date: string) {
  let next = addDays(date, 1)
  while (isWeekend(next)) next = addDays(next, 1)
  return next
}

export interface DayTheme {
  weekday: number
  theme: string
  example: string
}

export interface RoutineTaskDef {
  id: string
  weekday: number | null
  title: string
  category: TaskCategory
  link: string | null
  sortOrder: number
}

export const taskLinkOptions = [
  { value: '/admin/marketing/partners', label: 'Partners' },
  { value: '/admin/marketing/metrics', label: 'Metrics' },
  { value: '/admin/marketing/playbook', label: 'Playbook' },
  { value: '/admin/pipeline', label: 'Pipeline' },
]

export type PlaybookSection =
  | 'mission'
  | 'principle'
  | 'daily_extra'
  | 'content_pillar'
  | 'format'
  | 'partnership'
  | 'partner_criterion'
  | 'outreach_step'
  | 'metric'
  | 'checklist'

export interface PlaybookDetails {
  value?: string
  ideas?: string[]
  highlight?: string
  weGive?: string
  theyGive?: string
  tracking?: string
  why?: string
  howToMeasure?: string
}

export interface PlaybookItem {
  id: number
  section: PlaybookSection
  title: string
  body: string
  details: PlaybookDetails
  sortOrder: number
}

export type PlaybookField = 'title' | 'body' | keyof PlaybookDetails

export interface PlaybookSectionMeta {
  label: string
  // Fields the edit form shows, in order, with their labels.
  fields: { key: PlaybookField; label: string; multiline?: boolean }[]
  // Single-item sections can be edited but not added to or removed.
  single?: boolean
}

export const playbookSectionMeta: Record<PlaybookSection, PlaybookSectionMeta> = {
  mission: { label: 'Strategy at a Glance', single: true, fields: [{ key: 'body', label: 'Mission', multiline: true }] },
  principle: {
    label: 'Principles',
    fields: [
      { key: 'title', label: 'Name' },
      { key: 'value', label: 'Headline' },
      { key: 'body', label: 'Description', multiline: true },
    ],
  },
  daily_extra: { label: 'Every Day', single: true, fields: [{ key: 'body', label: 'Daily habits', multiline: true }] },
  content_pillar: {
    label: 'Content Pillars',
    fields: [
      { key: 'title', label: 'Pillar' },
      { key: 'body', label: 'Purpose', multiline: true },
      { key: 'ideas', label: 'Post ideas (one per line)', multiline: true },
    ],
  },
  format: {
    label: 'Formats That Work',
    fields: [
      { key: 'title', label: 'Format' },
      { key: 'body', label: 'Description', multiline: true },
    ],
  },
  partnership: {
    label: 'Partnership Models',
    fields: [
      { key: 'title', label: 'Model' },
      { key: 'highlight', label: 'Highlight tag (optional)' },
      { key: 'body', label: 'How it works', multiline: true },
      { key: 'weGive', label: 'We give', multiline: true },
      { key: 'theyGive', label: 'They give', multiline: true },
      { key: 'tracking', label: 'How we track it', multiline: true },
    ],
  },
  partner_criterion: { label: 'What Makes a Good Partner', fields: [{ key: 'body', label: 'Criterion' }] },
  outreach_step: {
    label: 'Finding & Approaching Partners',
    fields: [
      { key: 'title', label: 'Step' },
      { key: 'body', label: 'Description', multiline: true },
    ],
  },
  metric: {
    label: 'What We Measure',
    fields: [
      { key: 'title', label: 'Metric' },
      { key: 'why', label: 'Why it matters' },
      { key: 'howToMeasure', label: 'How to measure' },
    ],
  },
  checklist: { label: 'Weekly Checklist', fields: [{ key: 'body', label: 'Task' }] },
}

export const playbookSections = Object.keys(playbookSectionMeta) as PlaybookSection[]
