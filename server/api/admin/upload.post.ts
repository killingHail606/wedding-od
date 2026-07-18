import { randomBytes } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

const MAX_BYTES = 12 * 1024 * 1024 // 12 MB

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find(p => p.name === 'file' && p.filename)
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file' })
  }

  const ext = EXT_BY_TYPE[file.type || '']
  if (!ext) {
    throw createError({ statusCode: 415, statusMessage: 'Unsupported image type' })
  }
  if (file.data.length > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'File too large (max 12 MB)' })
  }

  const name = `${Date.now()}-${randomBytes(6).toString('hex')}.${ext}`
  const dir = ensureUploadsDir()
  await writeFile(join(dir, name), file.data)

  // Absolute same-origin URL so @nuxt/image can optimize it (the site's own
  // host is allow-listed in image.domains).
  const siteUrl = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  return { url: `${siteUrl}/uploads/${name}` }
})
