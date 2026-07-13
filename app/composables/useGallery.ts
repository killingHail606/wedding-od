import type { GalleryPhoto } from '#shared/types'

/**
 * Shared lightbox state for the images scattered across the page.
 * The page fills `photos`; interlude images call `open(index)`.
 */
export function useGallery() {
  const photos = useState<GalleryPhoto[]>('gallery-photos', () => [])
  const activeIndex = useState<number | null>('gallery-index', () => null)

  const open = (i: number) => (activeIndex.value = i)
  const close = () => (activeIndex.value = null)
  const navigate = (i: number) => (activeIndex.value = i)

  return { photos, activeIndex, open, close, navigate }
}
