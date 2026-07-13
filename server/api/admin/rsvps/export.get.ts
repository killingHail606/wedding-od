import { desc } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value)
  return `"${s.replace(/"/g, '""')}"`
}

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = useDb()
  const rows = db
    .select()
    .from(schema.rsvps)
    .orderBy(desc(schema.rsvps.createdAt))
    .all()

  const header = [
    'Імʼя', 'Прізвище', 'Присутність', 'З дітьми', 'Кількість дітей',
    'Тост', 'Алергії', 'Коментар', 'Дата',
  ]
  const lines = rows.map(r => [
    r.firstName,
    r.lastName,
    r.attending ? 'Так' : 'Ні',
    r.withChildren ? 'Так' : 'Ні',
    r.childrenCount,
    r.wantsToast ? 'Так' : 'Ні',
    r.allergies ?? '',
    r.comment ?? '',
    r.createdAt,
  ].map(csvCell).join(','))

  // Prepend BOM so Excel reads UTF-8 (Cyrillic) correctly.
  const csv = `﻿${[header.map(csvCell).join(','), ...lines].join('\n')}`

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename="rsvps.csv"')
  return csv
})
