import { z } from 'zod'

const schema = z.object({ password: z.string().min(1) })

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Bad request' })
  }

  if (!checkPassword(parsed.data.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Невірний пароль' })
  }

  startAdminSession(event)
  return { ok: true }
})
