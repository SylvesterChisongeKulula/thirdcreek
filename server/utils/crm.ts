import { eq } from 'drizzle-orm'
import * as tables from '../db/schema'
import type { Db } from '../db/client'
import { storeLocations, type Contact } from '../../app/data/crm-contacts'
import type { Lead } from '../../app/data/crm-leads'
import { leadSources } from '../../app/data/marketing'
import { brands, type Brand } from '../../app/data/products'

// All branches are in Zambia, so "today" is the Lusaka calendar day, not the server's UTC day.
const lusakaDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lusaka' })

export function todayISO() {
  return lusakaDate.format(new Date())
}

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>

const text = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export function parseContactInput(body: Partial<ContactInput>): ContactInput {
  const name = text(body.name)
  const phone = text(body.phone)
  if (!name || !phone) throw createError({ statusCode: 400, statusMessage: 'Name and phone are required' })
  if (!body.location || !storeLocations.includes(body.location)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid branch' })
  }
  const vehicleBrands = Array.isArray(body.vehicleBrands) ? body.vehicleBrands : []
  if (vehicleBrands.some((brand) => !brands.includes(brand))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid vehicle brand' })
  }
  return {
    name,
    phone,
    whatsapp: text(body.whatsapp) || phone,
    email: text(body.email),
    location: body.location,
    vehicleBrands: [...new Set(vehicleBrands)],
    tags: (Array.isArray(body.tags) ? body.tags : []).map(text).filter(Boolean),
  }
}

export type LeadInput = Omit<Lead, 'id' | 'stage' | 'createdAt' | 'lastUpdated'>

export async function parseLeadInput(db: Db, body: Partial<LeadInput>): Promise<LeadInput> {
  const name = text(body.name)
  const phone = text(body.phone)
  const partsNeeded = text(body.partsNeeded)
  const assignedTo = text(body.assignedTo)
  const estimatedValue = Number(body.estimatedValue)
  if (!name || !phone || !partsNeeded || !assignedTo || !(estimatedValue > 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, phone, parts needed, staff and a value greater than zero are required',
    })
  }
  if (!body.location || !storeLocations.includes(body.location)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid branch' })
  }
  if (!body.vehicleBrand || !brands.includes(body.vehicleBrand as Brand)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid vehicle brand' })
  }
  const source = body.source ?? 'Other'
  if (!leadSources.includes(source)) throw createError({ statusCode: 400, statusMessage: 'Invalid lead source' })

  const partnerId = source === 'Partner referral' ? body.partnerId || null : null
  if (partnerId) {
    const partner = await db
      .select({ id: tables.marketingPartners.id })
      .from(tables.marketingPartners)
      .where(eq(tables.marketingPartners.id, partnerId))
      .get()
    if (!partner) throw createError({ statusCode: 400, statusMessage: 'Unknown referring partner' })
  }

  const contactId = body.contactId || undefined
  if (contactId) {
    const contact = await db.select({ id: tables.contacts.id }).from(tables.contacts).where(eq(tables.contacts.id, contactId)).get()
    if (!contact) throw createError({ statusCode: 400, statusMessage: 'Unknown contact' })
  }

  return {
    name,
    phone,
    location: body.location,
    vehicleBrand: body.vehicleBrand,
    partsNeeded,
    estimatedValue: Math.round(estimatedValue),
    assignedTo,
    source,
    partnerId,
    contactId,
  }
}

// Staff only work with records in their own branch.
export function assertBranchAccess(user: { authRole?: string; location?: string } | undefined, location: string, action: string) {
  if (user?.authRole === 'staff' && location !== user.location) {
    throw createError({ statusCode: 403, statusMessage: `Cannot ${action} outside your branch` })
  }
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function generateContactId(db: Db, name: string) {
  const safeBase = slugify(name) || 'contact'
  let id = safeBase
  let suffix = 2
  while (await db.select().from(tables.contacts).where(eq(tables.contacts.id, id)).get()) {
    id = `${safeBase}-${suffix}`
    suffix += 1
  }
  return id
}

export async function generateLeadId(db: Db) {
  const existing = await db.select({ id: tables.leads.id }).from(tables.leads).all()
  const ids = new Set(existing.map((row) => row.id))
  let n = existing.length + 1
  let id = `lead-${String(n).padStart(3, '0')}`
  while (ids.has(id)) {
    n += 1
    id = `lead-${String(n).padStart(3, '0')}`
  }
  return id
}

export async function createContactRecord(db: Db, input: ContactInput): Promise<Contact> {
  const id = await generateContactId(db, input.name)
  const createdAt = todayISO()
  await db.insert(tables.contacts).values({ ...input, id, createdAt })
  return { ...input, id, createdAt, notes: [], purchaseHistory: [] }
}

export async function getFullContacts(db: Db): Promise<Contact[]> {
  const [contactRows, noteRows, purchaseRows] = await Promise.all([
    db.select().from(tables.contacts).all(),
    db.select().from(tables.contactNotes).all(),
    db.select().from(tables.purchases).all(),
  ])

  return contactRows.map((contact) => ({
    ...contact,
    notes: noteRows
      .filter((note) => note.contactId === contact.id)
      .map(({ date, author, text }) => ({ date, author, text })),
    purchaseHistory: purchaseRows
      .filter((purchase) => purchase.contactId === contact.id)
      .map(({ date, item, amount }) => ({ date, item, amount })),
  }))
}
