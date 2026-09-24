import type { CSSProperties } from 'react'
import { isRealDate } from '@/lib/event'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LOCALE,
  invitationLanguage,
  localized,
  type Language,
} from '@/lib/language'
import type { DashboardEvent } from '@/types/dashboard'
import type {
  Palette,
  InvitationTemplate,
  TemplateColor,
  TemplateValues,
} from '@/types/invitation'

/**
 * A template's palette and fonts reach the DOM as custom properties, so the
 * card and the RSVP chrome both read one source and no colour is written
 * twice. Same reasoning as `repliesBarVars`: the component hands over
 * values, never presentation.
 */
export function templateVars(template: InvitationTemplate): CSSProperties {
  const { palette } = template
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
    ...templateFontVars(template),
  } as CSSProperties
}

/**
 * The faces on their own. Split out for the print page, which wears the
 * template's fonts but not its colours — spreading the whole of
 * `templateVars` there would leave the template's palette on the page under
 * the print one, ready for the first `var(--c7)` to pick up.
 */
export function templateFontVars(template: InvitationTemplate): CSSProperties {
  const { fonts } = template
  return {
    '--font-primary': `var(${fonts.primary.cssVar})`,
    '--font-secondary': `var(${fonts.secondary.cssVar})`,
  } as CSSProperties
}

/**
 * A template colour as a value CSS can take. Roles are read straight off the
 * palette rather than left as `var(--c3)`, because the pages that ask for
 * these — the print page — deliberately do not carry the template's palette:
 * they wear its fonts alone, so a var would resolve against whatever palette
 * that page painted itself from.
 */
function colorValue(
  template: InvitationTemplate,
  color: TemplateColor,
): string {
  return template.palette[color] ?? 'transparent'
}

/**
 * The printable's colours, as the two vars the printed faces read. Named
 * apart from `--c*` so nothing on the print page can take them for the
 * palette it is otherwise painted from.
 */
export function printVars(template: InvitationTemplate): CSSProperties {
  const { print } = template
  return {
    '--print-card': colorValue(template, print.background),
    '--print-ink': colorValue(template, print.ink),
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

/** The event a guest link points at, or undefined when nothing matches. */
export function findByInvite(
  events: DashboardEvent[],
  param: string,
): DashboardEvent | undefined {
  return events.find((event) => event.slug === param)
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

/*
 * The language is taken from the event rather than passed in: a fallback is
 * copy a guest reads, so there is only ever one right answer for it, and
 * asking each caller to supply it would be inviting one of them to get it
 * wrong.
 */
export function seedValues(
  template: InvitationTemplate,
  event: DashboardEvent,
): TemplateValues {
  const language = invitationLanguage(event)
  const values: TemplateValues = { [EVENT_DATE]: event.date }
  for (const field of template.fields) {
    const fromEvent = FROM_EVENT[field.id]
    values[field.id] = fromEvent
      ? fromEvent(event)
      : localized(field.fallback, language)
  }
  return values
}

/**
 * A template previewed on its own, before any host has picked it — every
 * field is just its own fallback copy, since there is no event yet to seed
 * title/date/venue from, and no invitation to hold a language either.
 */
export function fallbackValues(
  template: InvitationTemplate,
  language: Language = DEFAULT_LANGUAGE,
): TemplateValues {
  const values: TemplateValues = { [EVENT_DATE]: MOCK_EVENT_DATE }
  for (const field of template.fields) {
    values[field.id] = localized(field.fallback, language)
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
  /**
   * `locale` is the invitation's own language, not the host's app locale —
   * a date on a card is guest-facing copy like any other.
   */
  render: (date: Date, locale: string) => string
  /**
   * Languages that never write a date this way. The editor leaves the style
   * out of their list, and an invitation in one of them that has it saved
   * reads as the default instead.
   */
  notIn?: Language[]
}

const pad = (part: number) => String(part).padStart(2, '0')

/** The month as the invitation's language writes it. */
function monthName(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
}

export const DATE_FORMATS: DateFormatOption[] = [
  {
    id: 'long',
    render: (date, locale) =>
      date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    /*
     * Month first is a style the host picks, so it is built rather than
     * asked for: `Intl` writes the parts in whatever order the language
     * prefers, which would collapse this option into `long` outside English.
     * Only the month name itself comes from the language.
     */
    id: 'monthFirst',
    render: (date, locale) =>
      `${monthName(date, locale)} ${date.getDate()}, ${date.getFullYear()}`,
    /*
     * English order. Romanian writes the day before the month, and Hungarian
     * already puts the month before the day, after the year.
     */
    notIn: ['ro', 'hu'],
  },
  {
    id: 'weekday',
    render: (date, locale) =>
      date.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
  },
  {
    /* Hungarian writes a numeric date year first: 2026. 09. 06. */
    id: 'dotted',
    render: (date, locale) =>
      locale === LANGUAGE_LOCALE.hu
        ? `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}.`
        : `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
  },
  {
    id: 'slashed',
    render: (date) =>
      `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`,
    notIn: ['hu'],
  },
]

/** What a template's `dateFormat` field falls back to. */
export const DEFAULT_DATE_FORMAT = DATE_FORMATS[0].id

/** The styles an invitation in this language can be written in. */
export function dateFormatsFor(language: Language): DateFormatOption[] {
  return DATE_FORMATS.filter((option) => !option.notIn?.includes(language))
}

/**
 * The event's date as the chosen format writes it. An unknown format id — a
 * value saved before the list changed, or a style the language does not use —
 * reads as the default rather than blanking the card's date line.
 */
export function formatInvitationDate(
  iso: string,
  formatId: string,
  language: Language = DEFAULT_LANGUAGE,
): string {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00`)
  if (!isRealDate(date)) return iso

  const format =
    dateFormatsFor(language).find((option) => option.id === formatId) ??
    DATE_FORMATS[0]
  return format.render(date, LANGUAGE_LOCALE[language])
}

/**
 * What the card is actually handed: the host's values with the date already
 * written out in the invitation's own language, so a template just prints
 * `values.date` and never has to know a format or a language was chosen.
 * Applied at render, not at seed, so the card follows the host's choice live
 * while the editor is open.
 */
export function cardValues(
  values: TemplateValues,
  language: Language = DEFAULT_LANGUAGE,
): TemplateValues {
  return {
    ...values,
    [EVENT_DATE]: formatInvitationDate(
      values[EVENT_DATE] ?? '',
      values.dateFormat ?? DEFAULT_DATE_FORMAT,
      language,
    ),
  }
}
