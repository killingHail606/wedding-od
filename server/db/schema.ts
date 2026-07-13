import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * The full editable site content is stored as a single JSON document.
 * There is always exactly one row (id = 1). The CMS reads and overwrites it.
 */
export const siteContent = sqliteTable('site_content', {
  id: integer('id').primaryKey(),
  data: text('data').notNull(),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  invitedToCeremony: integer('invited_to_ceremony', { mode: 'boolean' })
    .notNull()
    .default(false),
  note: text('note'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export const rsvps = sqliteTable('rsvps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').references(() => guests.id, {
    onDelete: 'set null',
  }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  attending: integer('attending', { mode: 'boolean' }).notNull(),
  withChildren: integer('with_children', { mode: 'boolean' })
    .notNull()
    .default(false),
  childrenCount: integer('children_count').notNull().default(0),
  wantsToast: integer('wants_toast', { mode: 'boolean' })
    .notNull()
    .default(false),
  allergies: text('allergies'),
  comment: text('comment'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export type SiteContentRow = typeof siteContent.$inferSelect
export type GuestRow = typeof guests.$inferSelect
export type RsvpRow = typeof rsvps.$inferSelect
