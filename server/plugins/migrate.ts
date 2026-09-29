import { migrate } from 'drizzle-orm/libsql/migrator'

export default defineNitroPlugin(async () => {
  // Apply pending migrations on server start (dev and production).
  const db = useDb()
  await migrate(db, { migrationsFolder: 'server/db/migrations' })

  // Auto-seed on boot, but only when explicitly opted in and only if the database is empty.
  // Intended for staging: set SEED_ON_BOOT=true there, leave it unset in production. Kept in
  // this same plugin (after the migrate() above completes) rather than a separate plugin file —
  // Nitro does not guarantee plugins run strictly sequentially by filename, and a second,
  // independent plugin racing its own migrate() call against this one can fail outright
  // (confirmed locally: concurrent migrate() calls raced and one hit "table already exists").
  if (process.env.SEED_ON_BOOT !== 'true') return

  const existingStaff = await db.select().from(tables.staff).all()
  if (existingStaff.length > 0) return

  const counts = await runSeed(db, {
    ownerName: 'Nalwamba Kabungo',
    ownerPassword: process.env.OWNER_DEV_PASSWORD ?? 'owner-dev-password',
    staffName: 'Mwansa Banda',
    staffPassword: process.env.STAFF_DEV_PASSWORD ?? 'staff-dev-password',
  })

  console.log(
    `[seed] Database was empty — seeded ${counts.staff} staff, ${counts.contacts} contacts, ${counts.leads} leads, ${counts.products} products.`,
  )
})
