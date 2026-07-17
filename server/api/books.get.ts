import type { BookPublic } from '#shared/types'

/**
 * Public wishlist endpoint. Returns every book with its `taken` status so the
 * page can show which are still available and which are already chosen.
 */
export default defineEventHandler((): BookPublic[] => {
  return getBooksWithStatus()
})
