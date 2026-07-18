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
  /** Optional partner for a "couple" invitation — shares one link. */
  partnerFirstName: text('partner_first_name'),
  partnerLastName: text('partner_last_name'),
  note: text('note'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

/**
 * Wishlist books guests can choose to gift. A book is considered "reserved"
 * once any RSVP references it (see `rsvps.giftBookId`) — there is no separate
 * reservation state, keeping a single source of truth.
 */
export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  author: text('author'),
  imageUrl: text('image_url'),
  url: text('url'),
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
  /** Whether the guest is bringing their partner, and their name. */
  withPartner: integer('with_partner', { mode: 'boolean' })
    .notNull()
    .default(false),
  partnerFirstName: text('partner_first_name'),
  partnerLastName: text('partner_last_name'),
  /** The wishlist book this guest chose to gift, if any. */
  giftBookId: integer('gift_book_id').references(() => books.id, {
    onDelete: 'set null',
  }),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
})

export type SiteContentRow = typeof siteContent.$inferSelect
export type GuestRow = typeof guests.$inferSelect
export type RsvpRow = typeof rsvps.$inferSelect
export type BookRow = typeof books.$inferSelect
