import * as tables from '../db/schema'
import { hashPassword } from './auth'
import { staff as staffData } from '../../app/data/crm-staff'
import { contacts as contactsData } from '../../app/data/crm-contacts'
import { leads as leadsData } from '../../app/data/crm-leads'
import { products as productsData } from '../../app/data/products'
import type { Db } from '../db/client'

export interface SeedCredentials {
  ownerName: string
  ownerPassword: string
  staffName: string
  staffPassword: string
}

export async function runSeed(db: Db, creds: SeedCredentials) {
  await db.transaction(async (tx) => {
    await tx.delete(tables.leads)
    await tx.delete(tables.purchases)
    await tx.delete(tables.contactNotes)
    await tx.delete(tables.contacts)
    await tx.delete(tables.staff)
    await tx.delete(tables.products)

    await tx.insert(tables.staff).values(
      staffData.map((member) => {
        if (member.name === creds.ownerName) {
          return { ...member, authRole: 'owner' as const, passwordHash: hashPassword(creds.ownerPassword) }
        }
        if (member.name === creds.staffName) {
          return { ...member, authRole: 'staff' as const, passwordHash: hashPassword(creds.staffPassword) }
        }
        return member
      }),
    )
    await tx.insert(tables.contacts).values(contactsData.map(({ notes, purchaseHistory, ...c }) => c))

    const notes = contactsData.flatMap((c) => c.notes.map((n) => ({ ...n, contactId: c.id })))
    const purchases = contactsData.flatMap((c) => c.purchaseHistory.map((p) => ({ ...p, contactId: c.id })))
    if (notes.length) await tx.insert(tables.contactNotes).values(notes)
    if (purchases.length) await tx.insert(tables.purchases).values(purchases)

    await tx.insert(tables.leads).values(leadsData)

    const createdAt = new Date().toISOString().slice(0, 10)
    await tx.insert(tables.products).values(productsData.map((p) => ({ ...p, createdAt })))
  })

  return { staff: staffData.length, contacts: contactsData.length, leads: leadsData.length, products: productsData.length }
}
