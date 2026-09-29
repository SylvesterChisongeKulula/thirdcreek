import { createDb, type Db } from '../db/client'

export * as tables from '../db/schema'

let db: Db | undefined

// Auto-imported in server routes: `const db = useDb()`
export function useDb() {
  db ??= createDb()
  return db
}
