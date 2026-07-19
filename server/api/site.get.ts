import type { GuestPublic, PublicContent, SiteResponse } from '#shared/types'

/**
 * Main data endpoint for the public page.
 * Returns the site content plus (optionally) the resolved guest.
 * The ceremony block is only included for guests invited to it.
 */
export default defineEventHandler((event): SiteResponse => {
  const query = getQuery(event)
  const token = typeof query.guest === 'string' ? query.guest : ''

  const content = getContent()
  const guestRow = token ? getGuestByToken(token) : undefined

  const invitedToCeremony = guestRow?.invitedToCeremony ?? false

  const publicContent: PublicContent = {
    ...content,
    // Ceremony details are private — strip both the venue block and the
    // ceremony timeline entries for guests not invited to it.
    timeline: invitedToCeremony
      ? content.timeline
      : content.timeline.filter(item => !item.ceremony),
    venue: {
      banquet: content.venue.banquet,
      ceremony: invitedToCeremony ? content.venue.ceremony : null,
    },
  }

  const guest: GuestPublic | null = guestRow
    ? {
        firstName: guestRow.firstName,
        lastName: guestRow.lastName,
        invitedToCeremony: guestRow.invitedToCeremony,
        partnerFirstName: guestRow.partnerFirstName,
        partnerLastName: guestRow.partnerLastName,
        envelopeImage: guestRow.envelopeImage,
      }
    : null

  return { content: publicContent, guest }
})
