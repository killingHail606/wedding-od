/**
 * Applies pending Drizzle migrations. Run with `pnpm db:migrate`.
 * Safe to run repeatedly — already-applied migrations are skipped.
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const dbPath = resolve(
  process.cwd(),
  process.env.NUXT_DATABASE_URL || './server/db/data/wedding.db',
)

const dir = dirname(dbPath)
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite)

migrate(db, { migrationsFolder: resolve(process.cwd(), 'server/db/migrations') })
console.log('✓ Migrations applied →', dbPath)
sqlite.close()
