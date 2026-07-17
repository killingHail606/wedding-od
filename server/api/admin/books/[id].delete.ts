import { eq } from 'drizzle-orm'
import { schema, useDb } from '../../../db'

export default defineEventHandler((event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const db = useDb()
  // The FK was added via ALTER TABLE without an ON DELETE action, so with
  // foreign_keys=ON we must detach any RSVP that reserved this book before
  // deleting it (the RSVP record itself is kept).
  db.transaction((tx) => {
    tx.update(schema.rsvps)
      .set({ giftBookId: null })
      .where(eq(schema.rsvps.giftBookId, id))
      .run()
    tx.delete(schema.books).where(eq(schema.books.id, id)).run()
  })
  return { ok: true }
})
