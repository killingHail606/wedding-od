import type { ComputedRef, InjectionKey } from 'vue'
import type { GuestPublic, PublicContent } from '#shared/types'

export interface SiteContext {
  content: ComputedRef<PublicContent>
  guest: ComputedRef<GuestPublic | null>
}

export const SiteKey: InjectionKey<SiteContext> = Symbol('wedding-site')

/**
 * Access the site content + resolved guest anywhere below the page that
 * provides them. The page guards rendering with `v-if`, so `content` is
 * guaranteed non-null wherever this is used.
 */
export function useSite(): SiteContext {
  const ctx = inject(SiteKey)
  if (!ctx) {
    throw new Error('useSite() must be called within a page providing SiteKey')
  }
  return ctx
}
