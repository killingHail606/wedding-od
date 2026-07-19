import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { schema, useDb } from '../../../db'

const schemaBody = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  invitedToCeremony: z.boolean().optional(),
  partnerFirstName: z.string().trim().max(80).nullable().optional(),
  partnerLastName: z.string().trim().max(80).nullable().optional(),
  envelopeImage: z.string().trim().max(1000).nullable().optional(),
  note: z.string().trim().max(300).nullable().optional(),
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
    throw createError({ statusCode: 422, statusMessage: 'Invalid guest' })
  }

  const db = useDb()
  const updated = db
    .update(schema.guests)
    .set(parsed.data)
    .where(eq(schema.guests.id, id))
    .returning()
    .get()

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Guest not found' })
  }
  return updated
})
