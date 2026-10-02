import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const rows = await useDb()
    .select({
      id: tables.staff.id,
      name: tables.staff.name,
      role: tables.staff.role,
      location: tables.staff.location,
      authRole: tables.staff.authRole,
      passwordHash: tables.staff.passwordHash,
    })
    .from(tables.staff)
    .orderBy(asc(tables.staff.name))
    .all()
  // Never send hashes to the client — only whether the person can log in.
  return rows.map(({ passwordHash, ...member }) => ({ ...member, hasLogin: !!passwordHash }))
})
