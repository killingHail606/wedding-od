import { z } from 'zod'

const venuePlace = z.object({
  name: z.string(),
  address: z.string(),
  timeLabel: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  googleMapsUrl: z.string(),
  wazeUrl: z.string(),
})

export const weddingContentSchema = z.object({
  couple: z.object({
    brideName: z.string(),
    groomName: z.string(),
    displayName: z.string(),
  }),
  event: z.object({
    dateTime: z.string(),
    dateLabel: z.string(),
    timeLabel: z.string(),
  }),
  hero: z.object({
    photo: z.string(),
    kicker: z.string(),
    invitationLine: z.string(),
  }),
  gallery: z.array(z.object({
    src: z.string(),
    alt: z.string(),
    orientation: z.enum(['portrait', 'landscape', 'square']),
  })),
  invitation: z.object({
    heading: z.string(),
    paragraphs: z.array(z.string()),
  }),
  venue: z.object({
    banquet: venuePlace,
    ceremony: venuePlace,
  }),
  timeline: z.array(z.object({
    time: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    ceremony: z.boolean().optional(),
  })),
  dressCode: z.object({
    description: z.string(),
    colors: z.array(z.object({ hex: z.string(), label: z.string() })),
  }),
  guestChat: z.object({
    heading: z.string(),
    text: z.string(),
    buttonLabel: z.string(),
    telegramUrl: z.string(),
  }),
  footer: z.object({
    coordinatorName: z.string(),
    phone: z.string(),
    telegram: z.string(),
    thankYou: z.string(),
    background: z.string(),
  }),
  rsvp: z.object({
    deadline: z.string(),
    deadlineLabel: z.string(),
    closedMessage: z.string(),
  }),
})
