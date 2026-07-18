import type { BookPublic } from '#shared/types'
import { asc } from 'drizzle-orm'
import { schema, useDb } from '../db'

/** Set of book ids that are already reserved by at least one RSVP. */
export function getReservedBookIds(): Set<number> {
  const db = useDb()
  const rows = db
    .selectDistinct({ bookId: schema.rsvpBooks.bookId })
    .from(schema.rsvpBooks)
    .all()
  return new Set(rows.map(r => r.bookId))
}

/** All wishlist books with their public reservation status. */
export function getBooksWithStatus(): BookPublic[] {
  const db = useDb()
  const rows = db
    .select()
    .from(schema.books)
    .orderBy(asc(schema.books.createdAt))
    .all()

  const reserved = getReservedBookIds()

  return rows.map(b => ({
    id: b.id,
    title: b.title,
    author: b.author,
    imageUrl: b.imageUrl,
    url: b.url,
    note: b.note,
    taken: reserved.has(b.id),
  }))
}
