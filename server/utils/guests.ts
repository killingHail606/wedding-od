import type { GuestRow } from '../db/schema'
import { eq } from 'drizzle-orm'
import { schema, useDb } from '../db'

/** Look up a guest by their personal invitation token. */
export function getGuestByToken(token: string): GuestRow | undefined {
  if (!token) return undefined
  const db = useDb()
  return db
    .select()
    .from(schema.guests)
    .where(eq(schema.guests.token, token))
    .get()
}
