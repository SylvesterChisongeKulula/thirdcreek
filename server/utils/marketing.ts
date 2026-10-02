import { and, eq, gte, inArray, isNotNull, isNull } from 'drizzle-orm'
import type { H3Event } from 'h3'
import * as tables from '../db/schema'
import type { Db } from '../db/client'
import {
  addDays,
  partnerModels,
  partnerStatuses,
  partnerTypes,
  playbookSectionMeta,
  playbookSections,
  taskCategories,
  taskLinkOptions,
  workweekday,
  type MarketingPartner,
  type PlaybookDetails,
  type PlaybookItem,
  type RoutineTaskDef,
} from '../../app/data/marketing'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function assertISODate(value: unknown, field: string): string {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) {
    throw createError({ statusCode: 400, statusMessage: `${field} must be a YYYY-MM-DD date` })
  }
  return value
}

export async function requireOwner(event: H3Event) {
  const session = await getUserSession(event)
  if (session.data?.authRole !== 'owner') {
    throw createError({ statusCode: 403, statusMessage: 'Only the owner can change this' })
  }
  return session.data
}

// Routine tasks are materialised as real rows the first time a date range is viewed, so they can be
// ticked off like any other task. The (date, routine_key) unique index makes this idempotent.
// Weekends are skipped: the marketing week runs Monday–Friday.
export async function ensureRoutineTasks(db: Db, from: string, to: string) {
  const [routine, themes] = await Promise.all([
    db.select().from(tables.marketingRoutineTasks).orderBy(tables.marketingRoutineTasks.sortOrder).all(),
    db.select().from(tables.marketingDayThemes).all(),
  ])
  const themeByDay = new Map(themes.map((row) => [row.weekday, row.theme]))

  const rows: (typeof tables.marketingTasks.$inferInsert)[] = []
  const createdAt = todayISO()
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const weekday = workweekday(date)
    if (!weekday) continue
    const theme = themeByDay.get(weekday) ?? 'Daily post'
    for (const task of routine) {
      if (task.weekday !== null && task.weekday !== weekday) continue
      rows.push({
        date,
        title: task.title.replaceAll('{theme}', theme),
        category: task.category,
        routineKey: task.id,
        link: task.link,
        createdAt,
      })
    }
  }
  if (rows.length) await db.insert(tables.marketingTasks).values(rows).onConflictDoNothing()
}

// After the routine or a day theme changes, drop upcoming unticked routine rows so they are recreated
// from the new definition on the next view. Past and ticked rows are kept as history.
export async function resetUpcomingRoutineTasks(db: Db, filter: { key?: string; weekday?: number } = {}) {
  const today = todayISO()
  const upcoming = await db
    .select({ id: tables.marketingTasks.id, date: tables.marketingTasks.date })
    .from(tables.marketingTasks)
    .where(
      and(
        gte(tables.marketingTasks.date, today),
        isNull(tables.marketingTasks.completedBy),
        filter.key ? eq(tables.marketingTasks.routineKey, filter.key) : isNotNull(tables.marketingTasks.routineKey),
      ),
    )
    .all()
  const ids = upcoming
    .filter((row) => filter.weekday === undefined || workweekday(row.date) === filter.weekday)
    .map((row) => row.id)
  if (ids.length) await db.delete(tables.marketingTasks).where(inArray(tables.marketingTasks.id, ids))
}

export async function generatePartnerId(db: Db, name: string) {
  const safeBase = slugify(name) || 'partner'
  let id = safeBase
  let suffix = 2
  while (await db.select().from(tables.marketingPartners).where(eq(tables.marketingPartners.id, id)).get()) {
    id = `${safeBase}-${suffix}`
    suffix += 1
  }
  return id
}

export type PartnerInput = Omit<MarketingPartner, 'id' | 'createdAt' | 'updatedAt'>

export function parsePartnerInput(body: Partial<PartnerInput>): PartnerInput {
  const name = body.name?.trim()
  if (!name) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  if (!body.partnerType || !partnerTypes.includes(body.partnerType)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid partner type' })
  }
  if (!body.model || !partnerModels.includes(body.model)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid partnership model' })
  }
  const status = body.status ?? 'Prospect'
  if (!partnerStatuses.includes(status)) throw createError({ statusCode: 400, statusMessage: 'Invalid status' })

  return {
    name,
    facebookUrl: body.facebookUrl?.trim() ?? '',
    followers: Math.max(0, Math.round(Number(body.followers) || 0)),
    partnerType: body.partnerType,
    model: body.model,
    referralCode: body.referralCode?.trim().toUpperCase() || null,
    status,
    notes: body.notes?.trim() ?? '',
  }
}

export async function assertReferralCodeFree(db: Db, code: string | null, exceptId?: string) {
  if (!code) return
  const existing = await db
    .select({ id: tables.marketingPartners.id })
    .from(tables.marketingPartners)
    .where(eq(tables.marketingPartners.referralCode, code))
    .get()
  if (existing && existing.id !== exceptId) {
    throw createError({ statusCode: 409, statusMessage: `Referral code ${code} is already in use` })
  }
}

export type RoutineInput = Pick<RoutineTaskDef, 'weekday' | 'title' | 'category' | 'link'>

export function parseRoutineInput(body: Partial<RoutineInput>): RoutineInput {
  const title = body.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Title is required' })
  if (!body.category || !taskCategories.includes(body.category)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid category' })
  }
  const weekday = body.weekday ?? null
  if (weekday !== null && !(Number.isInteger(weekday) && weekday >= 1 && weekday <= 5)) {
    throw createError({ statusCode: 400, statusMessage: 'Day must be Monday–Friday or every weekday' })
  }
  const link = body.link || null
  if (link && !taskLinkOptions.some((option) => option.value === link)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid link' })
  }
  return { weekday, title, category: body.category, link }
}

export type PlaybookInput = Pick<PlaybookItem, 'section' | 'title' | 'body' | 'details'>

// Keeps only the fields the section's form edits, trimmed; ideas become a clean string list.
export function parsePlaybookInput(body: Partial<PlaybookInput>): PlaybookInput {
  if (!body.section || !playbookSections.includes(body.section)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid section' })
  }
  const keys = playbookSectionMeta[body.section].fields.map((field) => field.key)
  const details: PlaybookDetails = {}
  for (const key of keys) {
    if (key === 'title' || key === 'body') continue
    const value = body.details?.[key]
    if (key === 'ideas') {
      const ideas = (Array.isArray(value) ? value : []).map((idea) => String(idea).trim()).filter(Boolean)
      if (ideas.length) details.ideas = ideas
    } else if (typeof value === 'string' && value.trim()) {
      details[key] = value.trim()
    }
  }
  const input = {
    section: body.section,
    title: keys.includes('title') ? (body.title?.trim() ?? '') : '',
    body: keys.includes('body') ? (body.body?.trim() ?? '') : '',
    details,
  }
  if (!input.title && !input.body && !Object.keys(details).length) {
    throw createError({ statusCode: 400, statusMessage: 'The item is empty' })
  }
  return input
}
