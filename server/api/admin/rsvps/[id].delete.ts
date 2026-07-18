import { eq } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

/**
 * Deletes an RSVP. Because a book counts as "reserved" only while some RSVP
 * references it (rsvps.giftBookId), removing the row automatically frees any
 * book this response had chosen — no separate cleanup needed.
 */
export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const db = useDb()
  db.delete(schema.rsvps).where(eq(schema.rsvps.id, id)).run()
  return { ok: true }
})
