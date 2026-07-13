export interface CalendarEvent {
  title: string
  description: string
  location: string
  start: Date
  durationHours: number
}

function toUtcStamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Builds a Google Calendar link and an .ics downloader for an event. */
export function useAddToCalendar(event: MaybeRefOrGetter<CalendarEvent>) {
  const details = computed(() => {
    const e = toValue(event)
    const end = new Date(e.start.getTime() + e.durationHours * 3600_000)
    return { e, start: toUtcStamp(e.start), end: toUtcStamp(end) }
  })

  const googleUrl = computed(() => {
    const { e, start, end } = details.value
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: e.title,
      dates: `${start}/${end}`,
      details: e.description,
      location: e.location,
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  })

  function downloadIcs() {
    const { e, start, end } = details.value
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding//Invitation//UK',
      'BEGIN:VEVENT',
      `UID:${start}-wedding@invitation`,
      `DTSTAMP:${toUtcStamp(new Date())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${e.title}`,
      `DESCRIPTION:${e.description}`,
      `LOCATION:${e.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return { googleUrl, downloadIcs }
}
