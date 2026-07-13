import { z } from 'zod'
import { schema, useDb } from '../db'

const rsvpSchema = z.object({
  guestToken: z.string().trim().max(64).optional(),
  firstName: z.string().trim().min(1, "Вкажіть імʼя").max(80),
  lastName: z.string().trim().min(1, 'Вкажіть прізвище').max(80),
  attending: z.boolean(),
  withChildren: z.boolean().default(false),
  childrenCount: z.number().int().min(0).max(20).default(0),
  wantsToast: z.boolean().default(false),
  allergies: z.string().trim().max(500).optional(),
  comment: z.string().trim().max(1000).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = rsvpSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation failed',
      data: { issues: parsed.error.issues },
    })
  }

  const input = parsed.data
  const childrenCount = input.attending && input.withChildren ? input.childrenCount : 0

  // Link to a guest if a valid token was provided.
  const guest = input.guestToken ? getGuestByToken(input.guestToken) : undefined

  const db = useDb()
  const inserted = db
    .insert(schema.rsvps)
    .values({
      guestId: guest?.id ?? null,
      firstName: input.firstName,
      lastName: input.lastName,
      attending: input.attending,
      withChildren: input.attending ? input.withChildren : false,
      childrenCount,
      wantsToast: input.attending ? input.wantsToast : false,
      allergies: input.allergies || null,
      comment: input.comment || null,
    })
    .returning()
    .get()

  // Best-effort Telegram notification.
  const status = input.attending ? '✅ Буде присутній(-я)' : '❌ Не зможе бути'
  const lines = [
    '<b>Нове підтвердження RSVP</b>',
    `${input.firstName} ${input.lastName}`,
    status,
  ]
  if (input.attending && input.withChildren) lines.push(`👶 Дітей: ${childrenCount}`)
  if (input.attending && input.wantsToast) lines.push('🎤 Хоче сказати тост')
  if (input.allergies) lines.push(`🍽 Алергії: ${input.allergies}`)
  if (input.comment) lines.push(`💬 ${input.comment}`)
  if (guest) lines.push(`🔗 Гість: ${guest.firstName} ${guest.lastName}`)
  await notifyTelegram(lines.join('\n'))

  return { ok: true, id: inserted.id }
})
