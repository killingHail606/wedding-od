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

  // Build the URL from the actual request origin (honouring proxy headers in
  // production) rather than a hard-coded siteUrl. This keeps the uploaded image
  // reachable on whatever host/port the site is really served from — otherwise
  // a dev server on a different port than NUXT_PUBLIC_SITE_URL yields a broken
  // link locally.
  const origin = getRequestURL(event, {
    xForwardedHost: true,
    xForwardedProto: true,
  }).origin
  return { url: `${origin}/uploads/${name}` }
})
