import type { WeddingContent } from '#shared/types'
import { eq } from 'drizzle-orm'
import { defaultContent } from '../../config/wedding.config'
import { schema, useDb } from '../db'

/** Reads the single content document, falling back to defaults if unseeded. */
export function getContent(): WeddingContent {
  const db = useDb()
  const row = db
    .select()
    .from(schema.siteContent)
    .where(eq(schema.siteContent.id, 1))
    .get()

  if (!row) return defaultContent
  try {
    return JSON.parse(row.data) as WeddingContent
  }
  catch {
    return defaultContent
  }
}

/** Overwrites the content document (upsert on id = 1). */
export function saveContent(content: WeddingContent): void {
  const db = useDb()
  const data = JSON.stringify(content)
  const now = new Date().toISOString()

  db.insert(schema.siteContent)
    .values({ id: 1, data, updatedAt: now })
    .onConflictDoUpdate({
      target: schema.siteContent.id,
      set: { data, updatedAt: now },
    })
    .run()
}
