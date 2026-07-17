/**
 * Seeds the single site_content row and a couple of demo guests.
 * Idempotent: content is only inserted if missing; run with `pnpm db:seed`.
 */
import { randomBytes } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import { seedBooks } from '../../config/books.seed'
import { defaultContent } from '../../config/wedding.config'
import * as schema from './schema'

const dbPath = resolve(
  process.cwd(),
  process.env.NUXT_DATABASE_URL || './server/db/data/wedding.db',
)
const dir = dirname(dbPath)
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

const sqlite = new Database(dbPath)
const db = drizzle(sqlite, { schema })

// Content (single row, id = 1)
const existing = db
  .select()
  .from(schema.siteContent)
  .where(eq(schema.siteContent.id, 1))
  .get()

if (existing) {
  console.log('• site_content already exists — leaving it untouched')
}
else {
  db.insert(schema.siteContent)
    .values({ id: 1, data: JSON.stringify(defaultContent) })
    .run()
  console.log('✓ Seeded site_content')
}

// Demo guests (only if none exist)
const guestCount = db.select().from(schema.guests).all().length
if (guestCount === 0) {
  const token = () => randomBytes(8).toString('hex')
  db.insert(schema.guests)
    .values([
      { token: token(), firstName: 'Ірина', lastName: 'Коваль', invitedToCeremony: true, note: 'Приклад: гість із церемонією' },
      { token: token(), firstName: 'Андрій', lastName: 'Мельник', invitedToCeremony: false, note: 'Приклад: лише банкет' },
    ])
    .run()
  console.log('✓ Seeded 2 demo guests')
}
else {
  console.log(`• ${guestCount} guests already exist — skipping demo guests`)
}

// Wishlist books (only if none exist)
const bookCount = db.select().from(schema.books).all().length
if (bookCount === 0) {
  db.insert(schema.books).values(seedBooks).run()
  console.log(`✓ Seeded ${seedBooks.length} wishlist books`)
}
else {
  console.log(`• ${bookCount} books already exist — skipping book seed`)
}

sqlite.close()
console.log('Done.')
