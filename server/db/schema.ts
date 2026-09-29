import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import type { Brand, Category } from '../../app/data/products'
import type { StoreLocation } from '../../app/data/crm-contacts'
import type { LeadStage } from '../../app/data/crm-leads'

export const staff = sqliteTable('staff', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  role: text('role').notNull(),
  location: text('location').$type<StoreLocation>().notNull(),
  authRole: text('auth_role').$type<'owner' | 'staff'>().notNull().default('staff'),
  passwordHash: text('password_hash'),
})

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp').notNull(),
  email: text('email').notNull(),
  location: text('location').$type<StoreLocation>().notNull(),
  vehicleBrands: text('vehicle_brands', { mode: 'json' }).$type<Brand[]>().notNull().default([]),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default([]),
  createdAt: text('created_at').notNull(),
})

export const contactNotes = sqliteTable('contact_notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contactId: text('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  author: text('author').notNull(),
  text: text('text').notNull(),
})

export const purchases = sqliteTable('purchases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contactId: text('contact_id').notNull().references(() => contacts.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  item: text('item').notNull(),
  amount: integer('amount').notNull(),
})

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  contactId: text('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  location: text('location').$type<StoreLocation>().notNull(),
  vehicleBrand: text('vehicle_brand').$type<Brand>().notNull(),
  partsNeeded: text('parts_needed').notNull(),
  estimatedValue: integer('estimated_value').notNull(),
  assignedTo: text('assigned_to').notNull(),
  stage: text('stage').$type<LeadStage>().notNull().default('New Lead'),
  createdAt: text('created_at').notNull(),
  lastUpdated: text('last_updated').notNull(),
})

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand').$type<Brand>().notNull(),
  category: text('category').$type<Category>().notNull(),
  blurb: text('blurb').notNull(),
  image: text('image').notNull(),
  createdAt: text('created_at').notNull(),
})
