import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Directory where uploaded images are stored. In production this lives on the
 * mounted Railway volume (same disk as the SQLite file) so it survives
 * redeploys. Served publicly at `/uploads` (see nuxt.config `publicAssets`).
 */
export function getUploadsDir(): string {
  const configured = process.env.NUXT_UPLOADS_DIR
  if (configured) return resolve(configured)

  // Fallback: sibling `uploads` folder next to the SQLite database file.
  const dbPath = process.env.NUXT_DATABASE_URL || './server/db/data/wedding.db'
  const dir = resolve(dirname(dbPath), 'uploads')
  return dir
}

/** Ensure the uploads directory exists and return its path. */
export function ensureUploadsDir(): string {
  const dir = getUploadsDir()
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}
