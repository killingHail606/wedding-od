import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

/** Resolve the SQLite file path from runtime config (falls back to default). */
function resolveDbPath(): string {
  const configured
    = process.env.NUXT_DATABASE_URL || './server/db/data/wedding.db'
  return resolve(process.cwd(), configured)
}

/** Lazy singleton Drizzle client backed by better-sqlite3. */
export function useDb() {
  if (_db) return _db

  const path = resolveDbPath()
  const dir = dirname(path)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  const sqlite = new Database(path)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  _db = drizzle(sqlite, { schema })
  return _db
}

export { schema }
