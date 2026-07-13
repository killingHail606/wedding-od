import { desc } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const db = useDb()
  return db
    .select()
    .from(schema.guests)
    .orderBy(desc(schema.guests.createdAt))
    .all()
})
