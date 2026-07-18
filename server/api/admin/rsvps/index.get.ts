import { desc, eq } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = useDb()
  const rows = db
    .select({
      id: schema.rsvps.id,
      guestId: schema.rsvps.guestId,
      firstName: schema.rsvps.firstName,
      lastName: schema.rsvps.lastName,
      attending: schema.rsvps.attending,
      withChildren: schema.rsvps.withChildren,
      childrenCount: schema.rsvps.childrenCount,
      wantsToast: schema.rsvps.wantsToast,
      allergies: schema.rsvps.allergies,
      comment: schema.rsvps.comment,
      withPartner: schema.rsvps.withPartner,
      partnerFirstName: schema.rsvps.partnerFirstName,
      partnerLastName: schema.rsvps.partnerLastName,
      createdAt: schema.rsvps.createdAt,
    })
    .from(schema.rsvps)
    .orderBy(desc(schema.rsvps.createdAt))
    .all()

  // Gift books per RSVP (many-to-many).
  const bookRows = db
    .select({
      rsvpId: schema.rsvpBooks.rsvpId,
      title: schema.books.title,
    })
    .from(schema.rsvpBooks)
    .innerJoin(schema.books, eq(schema.books.id, schema.rsvpBooks.bookId))
    .all()

  const booksByRsvp = new Map<number, string[]>()
  for (const b of bookRows) {
    const list = booksByRsvp.get(b.rsvpId) ?? []
    list.push(b.title)
    booksByRsvp.set(b.rsvpId, list)
  }

  const rsvps = rows.map(r => ({
    ...r,
    giftBooks: booksByRsvp.get(r.id) ?? [],
  }))

  const attending = rows.filter(r => r.attending)
  const summary = {
    total: rows.length,
    // Headcount: each attending guest, plus their partner when they bring one.
    attending: attending.reduce((sum, r) => sum + 1 + (r.withPartner ? 1 : 0), 0),
    declined: rows.length - attending.length,
    children: attending.reduce((sum, r) => sum + r.childrenCount, 0),
  }

  return { summary, rsvps }
})
