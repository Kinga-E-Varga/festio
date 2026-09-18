import type { CSSProperties } from 'react'
import { isRealDate } from '@/lib/event'
import type { DashboardEvent } from '@/types/dashboard'
import type {
  Palette,
  InvitationTemplate,
  TemplateValues,
} from '@/types/invitation'

/**
 * A template's palette and fonts reach the DOM as custom properties, so the
 * card and the RSVP chrome both read one source and no colour is written
 * twice. Same reasoning as `safeguardBarVars`: the component hands over
 * values, never presentation.
 */
export function templateVars(template: InvitationTemplate): CSSProperties {
  const { palette, fonts } = template
  return {
    '--c1': palette.color1,
    '--c2': palette.color2,
    '--c3': palette.color3,
    '--c4': palette.color4,
    '--c5': palette.color5,
    '--c6': palette.color6,
    '--c7': palette.color7,
    '--c8': palette.color8,
    '--c9': palette.color9,
    '--c10': palette.color10,
    '--font-primary': `var(${fonts.primary.cssVar})`,
    '--font-secondary': `var(${fonts.secondary.cssVar})`,
  } as CSSProperties
}

const COLOR_VAR: Record<keyof Palette, string> = {
  color1: '--c1',
  color2: '--c2',
  color3: '--c3',
  color4: '--c4',
  color5: '--c5',
  color6: '--c6',
  color7: '--c7',
  color8: '--c8',
  color9: '--c9',
  color10: '--c10',
}

/**
 * What shows behind the card, as a className plus whatever inline style an
 * image background needs. `Invitation` applies this once, on the page
 * wrapper; a template's own `Card` is free to reuse the same field for its
 * own root if it wants the two to match.
 */
export function pageBackground(template: InvitationTemplate): {
  className: string
  style?: CSSProperties
} {
  const { background } = template

  switch (background.kind) {
    case 'solid':
      return { className: `bg-[var(${COLOR_VAR[background.color]})]` }
    case 'image':
      return {
        className: `bg-repeat bg-center ${background.under ? `bg-[var(${COLOR_VAR[background.under]})]` : ''}`,
        style: {
          backgroundImage: `url(${background.src})`,
          backgroundSize: background.size ?? 'auto',
        },
      }
    case 'pattern':
      return { className: background.className }
  }
}

/**
 * Guest links are `slug-1657` — the host's slug with Festio's four digits
 * appended. The digits are the unguessable part, so a link missing them is
 * not a link at all.
 */
export function parseInviteParam(
  param: string,
): { slug: string; digits: string } | null {
  const match = /^(.+)-(\d{4})$/.exec(param)
  if (!match) return null
  return { slug: match[1], digits: match[2] }
}

/** The event a guest link points at, or undefined when nothing matches. */
export function findByInvite(
  events: DashboardEvent[],
  param: string,
): DashboardEvent | undefined {
  const parsed = parseInviteParam(param)
  if (!parsed) return undefined
  return events.find(
    (event) => event.slug === parsed.slug && event.digits === parsed.digits,
  )
}

/**
 * Fields the event already answers are seeded from it; the rest fall back to
 * the template's own copy, so a card is never blank before a host types.
 */
const FROM_EVENT: Record<string, (event: DashboardEvent) => string> = {
  title: (event) => event.title,
  date: (event) => event.date,
  time: (event) => event.time,
  venue: (event) => event.venue,
  address: (event) => event.address,
}

export function seedValues(
  template: InvitationTemplate,
  event: DashboardEvent,
): TemplateValues {
  const values: TemplateValues = { [EVENT_DATE]: event.date }
  for (const field of template.fields) {
    const fromEvent = FROM_EVENT[field.id]
    values[field.id] = fromEvent ? fromEvent(event) : field.fallback
  }
  return values
}

/**
 * A template previewed on its own, before any host has picked it — every
 * field is just its own fallback copy, since there is no event yet to seed
 * title/date/venue from.
 */
export function fallbackValues(template: InvitationTemplate): TemplateValues {
  const values: TemplateValues = { [EVENT_DATE]: MOCK_EVENT_DATE }
  for (const field of template.fields) {
    values[field.id] = field.fallback
  }
  return values
}

/**
 * The event's date, and the one value in `TemplateValues` no template declares
 * and no host edits here: it is set once in the event details and only ever
 * read by the card. What the invitation editor *does* offer is the format it
 * is written in — `dateFormat`, an ordinary field like any other.
 */
export const EVENT_DATE = 'date'

/** Stands in until the event-details form exists to supply a real one. */
export const MOCK_EVENT_DATE = '2024-08-24'

/**
 * How the date may be written on a card. App-level, not per template: this is
 * date rendering, not design, and a host moving between templates should not
 * lose the format they picked. `id` is stored in the host's values, so these
 * ids are permanent — rename one and existing invitations fall back.
 */
export interface DateFormatOption {
  id: string
  render: (date: Date) => string
}

const pad = (part: number) => String(part).padStart(2, '0')

export const DATE_FORMATS: DateFormatOption[] = [
  {
    id: 'long',
    render: (date) =>
      date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    id: 'monthFirst',
    render: (date) =>
      date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
  },
  {
    id: 'weekday',
    render: (date) =>
      date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    id: 'dotted',
    render: (date) =>
      `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
  },
  {
    id: 'slashed',
    render: (date) =>
      `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
  },
]

/** What a template's `dateFormat` field falls back to. */
export const DEFAULT_DATE_FORMAT = DATE_FORMATS[0].id

/**
 * The event's date as the chosen format writes it. An unknown format id — a
 * value saved before the list changed — reads as the default rather than
 * blanking the card's date line.
 */
export function formatInvitationDate(iso: string, formatId: string): string {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00`)
  if (!isRealDate(date)) return iso

  const format =
    DATE_FORMATS.find((option) => option.id === formatId) ?? DATE_FORMATS[0]
  return format.render(date)
}

/**
 * What the card is actually handed: the host's values with the date already
 * written out, so a template just prints `values.date` and never has to know
 * a format was chosen. Applied at render, not at seed, so the card follows
 * the host's choice live while the editor is open.
 */
export function cardValues(values: TemplateValues): TemplateValues {
  return {
    ...values,
    [EVENT_DATE]: formatInvitationDate(
      values[EVENT_DATE] ?? '',
      values.dateFormat ?? DEFAULT_DATE_FORMAT,
    ),
  }
}
