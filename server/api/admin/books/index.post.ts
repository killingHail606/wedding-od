import { z } from 'zod'
import { schema, useDb } from '../../../db'

const schemaBody = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().max(200).optional(),
  imageUrl: z.string().trim().max(1000).optional(),
  url: z.string().trim().max(1000).optional(),
  note: z.string().trim().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const parsed = schemaBody.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid book' })
  }

  const db = useDb()
  return db
    .insert(schema.books)
    .values({
      title: parsed.data.title,
      author: parsed.data.author || null,
      imageUrl: parsed.data.imageUrl || null,
      url: parsed.data.url || null,
      note: parsed.data.note || null,
    })
    .returning()
    .get()
})
