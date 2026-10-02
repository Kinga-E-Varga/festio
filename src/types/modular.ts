import type { ReactNode } from "react";
import type { Language, LocalizedText } from "@/lib/language";
import type { EventKind } from "@/types/dashboard";
import type { RsvpPayload, TemplateFonts } from "@/types/invitation";

/**
 * The 15 positional colour roles every palette fills: c1–c7 light grounds
 * and lines, c8–c10 ink, c11–c12 dark grounds, c13 the main accent, c14–c15
 * the secondary accents. On the page each is `--m1`…`--m15`.
 */
export type ColorRole =
  | "c1"
  | "c2"
  | "c3"
  | "c4"
  | "c5"
  | "c6"
  | "c7"
  | "c8"
  | "c9"
  | "c10"
  | "c11"
  | "c12"
  | "c13"
  | "c14"
  | "c15";

/** A premade palette. Hosts pick a whole one, never a single colour. */
export interface ModularPalette {
  id: string;
  name: string;
  colors: Record<ColorRole, string>;
}

/**
 * A pattern drawn on the invitation's ground (`--m4`), in palette roles
 * only. `className` holds the Tailwind classes that draw it.
 */
export interface ModularPattern {
  id: string;
  name: string;
  className: string;
}

/**
 * A premade font pair, the same shape simple templates use. For modular
 * invitations `primary` is the body text (the RSVP form already reads it)
 * and `secondary` the headings.
 */
export interface FontPair {
  id: string;
  name: string;
  fonts: TemplateFonts;
}

export type ScalarFieldType = "text" | "longText" | "time";

/** One field inside a list item — what a repeated group is made of. */
export interface ItemField {
  id: string;
  /** What the host's edit form calls it. Host chrome: the host's locale. */
  label: LocalizedText;
  type: ScalarFieldType;
  maxLength: number;
}

/** A single host-editable value, with the sample content that stands in for it. */
export interface ScalarField extends ItemField {
  fallback: LocalizedText;
}

/**
 * A repeating group: schedule items, FAQ entries, menu courses… Each item
 * holds one value per `item` field. A phrase is given in every language; a
 * name, a time or an address stays a plain string.
 */
export interface ListField {
  id: string;
  label: LocalizedText;
  type: "list";
  maxItems: number;
  item: ItemField[];
  fallback: Record<string, LocalizedText>[];
}

export type SectionField = ScalarField | ListField;

/**
 * One section, shared by every modular template. Its fields belong to it,
 * not to a variant: a variant may show fewer of them, never more, so
 * switching variants never loses content.
 */
export interface SectionDefinition {
  /** Permanent — events will store it. */
  id: string;
  /** What the host's editor calls the section. */
  name: LocalizedText;
  /** Top bar, cover, title, date & time, location and RSVP are always on. */
  required: boolean;
  /** The section's place in the fixed order: top bar 0, cover 10, title 20… */
  order: number;
  /** Shown as a link in the top bar and the mobile drawer when present. */
  menuLabel?: LocalizedText;
  fields: SectionField[];
}

/** A section folder's `index.ts`. */
export interface SectionModule {
  section: SectionDefinition;
}

/** One list item's values, keyed by `ItemField.id`. */
export type ListItem = Record<string, string>;

/** A section's content, already in the language it is read in. */
export type SectionValues = Record<string, string | ListItem[]>;

/**
 * Facts several sections show, entered once: the hosts' names, the date,
 * the venue. Phase 1 has no event, so they come from `SAMPLE_BASICS`.
 */
export interface InvitationBasics {
  hosts: string[];
  /** ISO `YYYY-MM-DD`. */
  date: string;
  venue: string;
  address: string;
}

/** A section with a menu label, as the top bar and the drawer link it. */
export interface MenuLink {
  id: string;
  label: string;
}

/** What the top bar needs from the page around it. */
export interface BarNav {
  links: MenuLink[];
  menuOpen: boolean;
  onOpenMenu: () => void;
}

export interface VariantProps {
  values: SectionValues;
  basics: InvitationBasics;
  /** The invitation's language — dates are written in it. */
  language: Language;
  /** The RSVP variant hands the guest's reply up; every other one ignores it. */
  onRsvp?: (payload: RsvpPayload) => void;
  /** Only the top bar's variants read it. */
  nav?: BarNav;
}

/** A variant file: `sections/<section>/<variant>.tsx`. */
export interface VariantModule {
  Variant: (props: VariantProps) => ReactNode;
}

export interface SectionChoice {
  section: string;
  variant: string;
}

/**
 * A modular template is only a preset: a palette, a font pair, an optional
 * ground pattern and the sections with a variant for each, in the fixed
 * order, RSVP last.
 */
export interface ModularTemplate {
  kind: "modular";
  id: string;
  name: string;
  package: "custom";
  eventTypes: EventKind[];
  palette: string;
  fontPair: string;
  /** No pattern: a plain ground. */
  pattern?: string;
  sections: SectionChoice[];
}

export interface ModularTemplateModule {
  template: ModularTemplate;
}

/** A template with its ids resolved — what the page draws from. */
export interface ModularDesign {
  palette: ModularPalette;
  fontPair: FontPair;
  pattern: ModularPattern | null;
  sections: { definition: SectionDefinition; variant: string }[];
}
