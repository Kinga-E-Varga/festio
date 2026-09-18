import type { EventKind, TierId } from '@/types/dashboard'

/**
 * The five colours the RSVP chrome is styled from. Roles are positional and
 * load-bearing — the shared guest form reads them by number, so reordering a
 * template's palette restyles the form. Templates may grow more colours for
 * their own decoration later; these five are the contract.
 */
export interface Palette {
  /** RSVP panel bg*/
  color1: string
  /** RSVP form accent text color */
  color2: string
  /** RSVP form base text color */
  color3: string
  /** RSVP form placeholder color */
  color4: string
  /** RSVP form hover color */
  color5: string
  /** RSVP form warning color */
  color6: string | null
  /** OPTIONAL custom colors */
  color7: string | null
  color8: string | null
  color9: string | null
  color10: string | null
}

/**
 * Input types templates can ask for. Deliberately small — the full set is
 * still unsettled, so a template may only request what Type 1 needs.
 */
export type FieldType = 'text' | 'longText' | 'date' | 'time' | 'dateFormat'

/**
 * Which surface a field's text is painted on, and so which group of the host's
 * editor it belongs to: the card itself, or the guest's reply panel beside it.
 * Absent means `card` — the common case, and what every field was before the
 * reply panel had any editable copy of its own.
 */
export type FieldScope = 'card' | 'rsvp'

/** One host-editable slot. The edit form is generated from these alone. */
export interface TemplateField {
  id: string
  label: string
  type: FieldType
  /** Typed input only — a `dateFormat` choice has nothing to cap. */
  maxLength?: number
  /** Seeds the field when the event carries nothing for it. */
  fallback: string
  scope?: FieldScope
}

/** The decorative strip where the RSVP surface meets the card. */
export type EdgeShape = 'wavy' | 'scalloped' | 'plain'

/**
 * What shows behind the card — page padding, the RSVP bar/panel ground, and
 * any letterboxing where the scaled card doesn't fill its slot.
 *
 * - `solid` reuses one of the template's own five palette colours, so the
 *   ground never needs a colour of its own that could drift from the rest of
 *   the design.
 * - `image` is a texture the template file imports and ships with itself
 *   (a design asset baked into the template, not a host-uploaded photo —
 *   those go through Firebase Storage instead). `under` fills in behind it
 *   with a palette colour, for a pattern that isn't fully opaque.
 * - `pattern` points at a named class from the shared pattern library in
 *   `globals.css` (next to `.edge`), for a CSS-drawn motif more than one
 *   template might want to reuse.
 */
export type TemplateBackground =
  | { kind: 'solid'; color: keyof Palette }
  | { kind: 'image'; src: string; size?: string; under?: keyof Palette }
  | { kind: 'pattern'; className: string }

/**
 * One font, declared once in `@/lib/fonts` and self-hosted at build time.
 * `className` applies the `next/font` variable class that defines `cssVar`;
 * `cssVar` is what the card and shared RSVP chrome write into `font-family`.
 */
export interface TemplateFont {
  className: string
  cssVar: string
}

/**
 * Fonts are template surface, like the palette: named by role, not by which
 * physical font fills it. The card and shared RSVP chrome read `--font-primary`
 * / `--font-secondary`; which font plays which role is the template's call.
 */
export interface TemplateFonts {
  primary: TemplateFont
  secondary: TemplateFont
}

/**
 * Everything the app knows about a template. One file exports one of these
 * plus its card, and nothing outside that file needs editing to add it.
 */
export interface InvitationTemplate {
  id: string
  name: string
  type: 1 | 2
  minTier: TierId
  /** Event kinds this design suits — a recommendation, not a restriction. */
  eventTypes: EventKind[]
  design: {
    width: number
    height: number
    /** Readability floor: below this the stage scrolls instead of shrinking. */
    minScale: number
    maxScale: number
  }
  /** Shown beside the print preview, e.g. "A5 portrait — 148 × 210 mm". */
  printSize: string
  palette: Palette
  fonts: TemplateFonts
  edge: EdgeShape
  background: TemplateBackground
  fields: TemplateField[]
}

/** Host-entered content, keyed by `TemplateField.id`. */
export type TemplateValues = Record<string, string>

/** A template file's public surface: the data, and the card that draws it. */
export interface TemplateModule {
  template: InvitationTemplate
  Card: (props: { values: TemplateValues }) => React.ReactNode
}

export type RsvpStatus = 'going' | 'not_going'

export interface RsvpAttendee {
  name: string
  status: RsvpStatus
}

/**
 * What the form hands to the write layer. Storage splits this into one
 * document per attendee and copies the note onto each, so the submission
 * shape here stays the way the guest filled it in.
 */
export interface RsvpPayload {
  attendees: RsvpAttendee[]
  answers: { q_note_host: string | null }
}
