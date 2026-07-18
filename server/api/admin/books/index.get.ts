import { asc, eq } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

export interface AdminBook {
  id: number
  title: string
  author: string | null
  imageUrl: string | null
  url: string | null
  note: string | null
  createdAt: string
  /** Name of the guest who reserved this book, or null if still available. */
  reservedBy: string | null
}

export default defineEventHandler((event): AdminBook[] => {
  requireAdmin(event)
  const db = useDb()

  const rows = db
    .select({
      id: schema.books.id,
      title: schema.books.title,
      author: schema.books.author,
      imageUrl: schema.books.imageUrl,
      url: schema.books.url,
      note: schema.books.note,
      createdAt: schema.books.createdAt,
      reservedFirst: schema.rsvps.firstName,
      reservedLast: schema.rsvps.lastName,
    })
    .from(schema.books)
    .leftJoin(schema.rsvpBooks, eq(schema.rsvpBooks.bookId, schema.books.id))
    .leftJoin(schema.rsvps, eq(schema.rsvps.id, schema.rsvpBooks.rsvpId))
    .orderBy(asc(schema.books.createdAt))
    .all()

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author,
    imageUrl: r.imageUrl,
    url: r.url,
    note: r.note,
    createdAt: r.createdAt,
    reservedBy: r.reservedFirst
      ? `${r.reservedFirst} ${r.reservedLast}`.trim()
      : null,
  }))
})
