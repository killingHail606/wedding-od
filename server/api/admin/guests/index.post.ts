import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { schema, useDb } from '../../../db'

const schemaBody = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  invitedToCeremony: z.boolean().default(false),
  partnerFirstName: z.string().trim().max(80).optional(),
  partnerLastName: z.string().trim().max(80).optional(),
  note: z.string().trim().max(300).optional(),
})

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const parsed = schemaBody.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid guest' })
  }

  const db = useDb()
  const guest = db
    .insert(schema.guests)
    .values({
      token: randomBytes(8).toString('hex'),
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      invitedToCeremony: parsed.data.invitedToCeremony,
      partnerFirstName: parsed.data.partnerFirstName || null,
      partnerLastName: parsed.data.partnerLastName || null,
      note: parsed.data.note || null,
    })
    .returning()
    .get()

  return guest
})
