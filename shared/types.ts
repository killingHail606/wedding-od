/**
 * Shared types available on both server and client (via the `#shared` alias).
 * The whole editable site content is a single JSON document stored in SQLite
 * and edited through the admin CMS.
 */

export interface CoupleContent {
  brideName: string
  groomName: string
  /** Display order for the hero, e.g. "Дарʼя & Олександр" */
  displayName: string
}

export interface EventContent {
  /** ISO date-time in local Kyiv time, e.g. "2026-09-26T14:00:00+03:00" */
  dateTime: string
  /** Human label, e.g. "26 вересня 2026" */
  dateLabel: string
  timeLabel: string
}

export interface HeroContent {
  photo: string
  kicker: string
  invitationLine: string
}

export interface GalleryPhoto {
  src: string
  alt: string
  orientation: 'portrait' | 'landscape' | 'square'
}

export interface InvitationContent {
  heading: string
  paragraphs: string[]
}

export interface VenuePlace {
  name: string
  address: string
  timeLabel?: string
  lat: number
  lng: number
  googleMapsUrl: string
  wazeUrl: string
}

export interface VenueContent {
  banquet: VenuePlace
  /** Ceremony is only revealed to guests invited to it. */
  ceremony: VenuePlace
}

export interface TimelineItem {
  time: string
  title: string
  description: string
  /** Iconify name, e.g. "ph:champagne" */
  icon: string
  /** Only shown to guests invited to the ceremony. */
  ceremony?: boolean
}

export interface DressCodeColor {
  hex: string
  label: string
}

export interface DressCodeContent {
  description: string
  colors: DressCodeColor[]
}

export interface GuestChatContent {
  heading: string
  text: string
  buttonLabel: string
  telegramUrl: string
}

export interface FooterContent {
  coordinatorName: string
  phone: string
  telegram: string
  thankYou: string
  /** Background image for the footer. */
  background: string
}

export interface RsvpContent {
  /** ISO date after which the form closes. Empty string = no deadline. */
  deadline: string
  deadlineLabel: string
  closedMessage: string
  /** Heading/question above the gift-a-book choice in the form. */
  giftQuestion: string
  /** Hint text under the gift-a-book question. */
  giftHint: string
}

export interface WeddingContent {
  couple: CoupleContent
  event: EventContent
  hero: HeroContent
  gallery: GalleryPhoto[]
  invitation: InvitationContent
  venue: VenueContent
  timeline: TimelineItem[]
  dressCode: DressCodeContent
  guestChat: GuestChatContent
  footer: FooterContent
  rsvp: RsvpContent
}

/**
 * Content as delivered to the public page. The ceremony block is stripped to
 * `null` for guests who are not invited to the ceremony (privacy).
 */
export type PublicContent = Omit<WeddingContent, 'venue'> & {
  venue: { banquet: VenuePlace, ceremony: VenuePlace | null }
}

export interface SiteResponse {
  content: PublicContent
  guest: GuestPublic | null
}

/** A guest with a personalized invitation link. */
export interface Guest {
  id: number
  token: string
  firstName: string
  lastName: string
  invitedToCeremony: boolean
  note: string | null
  createdAt: string
}

/** Public-safe subset of a guest, sent to the client for personalization. */
export interface GuestPublic {
  firstName: string
  lastName: string
  invitedToCeremony: boolean
  /** Set when the invitation was created for a couple (shared link). */
  partnerFirstName: string | null
  partnerLastName: string | null
  /** Personal background image for the invitation card (envelope intro). */
  envelopeImage: string | null
}

export interface RsvpEntry {
  id: number
  guestId: number | null
  firstName: string
  lastName: string
  attending: boolean
  withChildren: boolean
  childrenCount: number
  wantsToast: boolean
  allergies: string | null
  comment: string | null
  withPartner: boolean
  partnerFirstName: string | null
  partnerLastName: string | null
  giftBookId: number | null
  createdAt: string
}

/** Payload accepted by POST /api/rsvp */
export interface RsvpInput {
  guestToken?: string
  firstName: string
  lastName: string
  attending: boolean
  withChildren: boolean
  childrenCount: number
  wantsToast: boolean
  allergies?: string
  comment?: string
  /** Whether the guest is bringing their partner, and their name. */
  withPartner?: boolean
  partnerFirstName?: string
  partnerLastName?: string
  /** ids of the wishlist books the guest chose to gift, if any. */
  giftBookIds?: number[]
}

/** A wishlist book as delivered to the public page. */
export interface BookPublic {
  id: number
  title: string
  author: string | null
  imageUrl: string | null
  url: string | null
  note: string | null
  /** True once someone has chosen to gift this book. */
  taken: boolean
}
