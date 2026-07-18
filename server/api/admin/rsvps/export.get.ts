import { desc, eq } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = useDb()
  const rows = db
    .select({
      id: schema.rsvps.id,
      firstName: schema.rsvps.firstName,
      lastName: schema.rsvps.lastName,
      attending: schema.rsvps.attending,
      withPartner: schema.rsvps.withPartner,
      partnerFirstName: schema.rsvps.partnerFirstName,
      partnerLastName: schema.rsvps.partnerLastName,
      withChildren: schema.rsvps.withChildren,
      childrenCount: schema.rsvps.childrenCount,
      wantsToast: schema.rsvps.wantsToast,
      allergies: schema.rsvps.allergies,
      comment: schema.rsvps.comment,
      createdAt: schema.rsvps.createdAt,
    })
    .from(schema.rsvps)
    .orderBy(desc(schema.rsvps.createdAt))
    .all()

  // Gift books per RSVP (many-to-many), joined into one cell.
  const bookRows = db
    .select({ rsvpId: schema.rsvpBooks.rsvpId, title: schema.books.title })
    .from(schema.rsvpBooks)
    .innerJoin(schema.books, eq(schema.books.id, schema.rsvpBooks.bookId))
    .all()
  const booksByRsvp = new Map<number, string[]>()
  for (const b of bookRows) {
    const list = booksByRsvp.get(b.rsvpId) ?? []
    list.push(b.title)
    booksByRsvp.set(b.rsvpId, list)
  }

  const header = [
    'Імʼя', 'Прізвище', 'Присутність', 'Друга половинка', 'З дітьми', 'Кількість дітей',
    'Тост', 'Алергії', 'Книга', 'Коментар', 'Дата',
  ]
  const lines = rows.map(r => [
    r.firstName,
    r.lastName,
    r.attending ? 'Так' : 'Ні',
    r.withPartner ? `${r.partnerFirstName ?? ''} ${r.partnerLastName ?? ''}`.trim() : '',
    r.withChildren ? 'Так' : 'Ні',
    r.childrenCount,
    r.wantsToast ? 'Так' : 'Ні',
    r.allergies ?? '',
    (booksByRsvp.get(r.id) ?? []).join(', '),
    r.comment ?? '',
    r.createdAt,
  ].map(csvCell).join(','))

  // Prepend BOM so Excel reads UTF-8 (Cyrillic) correctly.
  const csv = `﻿${[header.map(csvCell).join(','), ...lines].join('\n')}`

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="rsvps.csv"')
  return csv
})
