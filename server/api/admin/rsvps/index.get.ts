import { desc } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = useDb()
  const rows = db
    .select()
    .from(schema.rsvps)
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
