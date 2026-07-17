import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { schema, useDb } from '../../../db'

const schemaBody = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  author: z.string().trim().max(200).nullable().optional(),
  imageUrl: z.string().trim().max(1000).nullable().optional(),
  url: z.string().trim().max(1000).nullable().optional(),
  note: z.string().trim().max(500).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid id' })
  }

  const body = await readBody(event)
  const parsed = schemaBody.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid book' })
  }

  // Normalize empty strings to null for optional text fields.
  const patch = Object.fromEntries(
    Object.entries(parsed.data).map(([k, v]) => [k, v === '' ? null : v]),
  )

  const db = useDb()
  const updated = db
    .update(schema.books)
    .set(patch)
    .where(eq(schema.books.id, id))
    .returning()
    .get()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Book not found' })
  }
  return updated
})
