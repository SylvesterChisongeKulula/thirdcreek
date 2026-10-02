import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'
import type { Brand, Category } from '../../app/data/products'
import type { StoreLocation } from '../../app/data/crm-contacts'
import type { LeadStage } from '../../app/data/crm-leads'
import type {
  LeadSource,
  PartnerModel,
  PartnerStatus,
  PartnerType,
  PlaybookDetails,
  PlaybookSection,
  TaskCategory,
} from '../../app/data/marketing'

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
  source: text('source').$type<LeadSource>().notNull().default('Other'),
  partnerId: text('partner_id').references(() => marketingPartners.id, { onDelete: 'set null' }),
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

export const marketingPartners = sqliteTable('marketing_partners', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  facebookUrl: text('facebook_url').notNull().default(''),
  followers: integer('followers').notNull().default(0),
  partnerType: text('partner_type').$type<PartnerType>().notNull(),
  model: text('model').$type<PartnerModel>().notNull(),
  referralCode: text('referral_code').unique(),
  status: text('status').$type<PartnerStatus>().notNull().default('Prospect'),
  notes: text('notes').notNull().default(''),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
})

export const marketingTasks = sqliteTable(
  'marketing_tasks',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    date: text('date').notNull(),
    title: text('title').notNull(),
    category: text('category').$type<TaskCategory>().notNull(),
    routineKey: text('routine_key'),
    link: text('link'),
    assignedTo: text('assigned_to'),
    completedBy: text('completed_by'),
    completedAt: text('completed_at'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [uniqueIndex('marketing_tasks_date_routine_idx').on(table.date, table.routineKey)],
)

export const marketingEngagement = sqliteTable('marketing_engagement', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  weekStart: text('week_start').notNull().unique(),
  postsPublished: integer('posts_published').notNull().default(0),
  comments: integer('comments').notNull().default(0),
  messages: integer('messages').notNull().default(0),
  newFollowers: integer('new_followers').notNull().default(0),
  reach: integer('reach').notNull().default(0),
  notes: text('notes').notNull().default(''),
  loggedBy: text('logged_by').notNull(),
  createdAt: text('created_at').notNull(),
})

export const marketingDayThemes = sqliteTable('marketing_day_themes', {
  // 1 = Monday … 5 = Friday
  weekday: integer('weekday').primaryKey(),
  theme: text('theme').notNull(),
  example: text('example').notNull().default(''),
})

export const marketingRoutineTasks = sqliteTable('marketing_routine_tasks', {
  id: text('id').primaryKey(),
  // 1 = Monday … 5 = Friday; null = every weekday
  weekday: integer('weekday'),
  // May contain {theme}, replaced with the day's theme when the task is scheduled.
  title: text('title').notNull(),
  category: text('category').$type<TaskCategory>().notNull(),
  link: text('link'),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const marketingPlaybookItems = sqliteTable('marketing_playbook_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  section: text('section').$type<PlaybookSection>().notNull(),
  title: text('title').notNull().default(''),
  body: text('body').notNull().default(''),
  details: text('details', { mode: 'json' }).$type<PlaybookDetails>().notNull().default({}),
  sortOrder: integer('sort_order').notNull().default(0),
})
