import { eq } from 'drizzle-orm'
import * as tables from '../db/schema'
import type { Db } from '../db/client'
import type { Contact } from '../../app/data/crm-contacts'

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function currency(value: number) {
  return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', maximumFractionDigits: 0 }).format(value)
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

export async function createContactRecord(
  db: Db,
  input: Omit<Contact, 'id' | 'createdAt' | 'notes' | 'purchaseHistory'>,
): Promise<Contact> {
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
