import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
}

/**
 * Serves uploaded images from the persistent volume (see getUploadsDir).
 * A plain route — unlike Nitro publicAssets — picks up files written at
 * runtime, which is exactly what admin uploads are.
 */
export default defineEventHandler((event) => {
  const rel = (getRouterParam(event, 'path') || '').replace(/^\/+/, '')
  // Prevent path traversal.
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '')
  if (safe.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Bad path' })
  }

  const dir = getUploadsDir()
  const filePath = join(dir, safe)
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const type = MIME[extname(filePath).toLowerCase()]
  if (!type) throw createError({ statusCode: 415, statusMessage: 'Unsupported' })

  setHeader(event, 'Content-Type', type)
  setHeader(event, 'Cache-Control', 'public, max-age=604800, immutable')
  return sendStream(event, createReadStream(filePath))
})
