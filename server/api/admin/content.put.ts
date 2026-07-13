export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const body = await readBody(event)
  const parsed = weddingContentSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid content',
      data: { issues: parsed.error.issues },
    })
  }
  saveContent(parsed.data)
  return { ok: true }
})
