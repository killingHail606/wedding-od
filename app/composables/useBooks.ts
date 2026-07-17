import type { BookPublic } from '#shared/types'

/**
 * Shared wishlist state so the gifts popup and the RSVP form stay in sync.
 * A single source of truth means picking a book in the form immediately
 * reflects in the popup (and vice-versa) after a refresh.
 */
export function useBooks() {
  const books = useState<BookPublic[]>('wishlist-books', () => [])
  const pending = useState('wishlist-books-pending', () => false)
  const loaded = useState('wishlist-books-loaded', () => false)

  async function load(force = false) {
    if (loaded.value && !force) return
    pending.value = true
    try {
      books.value = await $fetch<BookPublic[]>('/api/books')
      loaded.value = true
    }
    finally {
      pending.value = false
    }
  }

  const available = computed(() => books.value.filter(b => !b.taken))
  const hasBooks = computed(() => books.value.length > 0)

  return { books, available, hasBooks, pending, loaded, load }
}
