import { mkdirSync } from 'node:fs'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const DATABASE_URL = process.env.DATABASE_URL ?? 'file:.data/thirdcreek.db'

export function createDb(url = DATABASE_URL) {
  if (url.startsWith('file:')) mkdirSync('.data', { recursive: true })
  const client = createClient({ url })
  return drizzle(client, { schema })
}

export type Db = ReturnType<typeof createDb>
