// Loads the mock CRM data from app/data into the database. Run: npm run db:seed
// Also grants two dev login accounts (owner + one branch staff) so both roles are testable. Dev-only passwords — never reuse in production.
import { migrate } from 'drizzle-orm/libsql/migrator'
import { createDb } from './client'
import { runSeed } from '../utils/seed'

const OWNER_NAME = 'Nalwamba Kabungo'
const OWNER_PASSWORD = process.env.OWNER_DEV_PASSWORD ?? 'owner-dev-password'
const STAFF_NAME = 'Mwansa Banda'
const STAFF_PASSWORD = process.env.STAFF_DEV_PASSWORD ?? 'staff-dev-password'

const db = createDb()
await migrate(db, { migrationsFolder: 'server/db/migrations' })

const counts = await runSeed(db, {
  ownerName: OWNER_NAME,
  ownerPassword: OWNER_PASSWORD,
  staffName: STAFF_NAME,
  staffPassword: STAFF_PASSWORD,
})

console.log(`Seeded ${counts.staff} staff, ${counts.contacts} contacts, ${counts.leads} leads, ${counts.products} products`)
console.log(`Dev logins — owner: "${OWNER_NAME}" / "${OWNER_PASSWORD}"  |  staff: "${STAFF_NAME}" / "${STAFF_PASSWORD}"`)
