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
      giftBookId: schema.rsvps.giftBookId,
      giftBookTitle: schema.books.title,
      createdAt: schema.rsvps.createdAt,
    })
    .from(schema.rsvps)
    .leftJoin(schema.books, eq(schema.books.id, schema.rsvps.giftBookId))
    .orderBy(desc(schema.rsvps.createdAt))
    .all()

  const attending = rows.filter(r => r.attending)
  const summary = {
    total: rows.length,
    attending: attending.length,
    declined: rows.length - attending.length,
    children: attending.reduce((sum, r) => sum + r.childrenCount, 0),
  }

  return { summary, rsvps: rows }
})
