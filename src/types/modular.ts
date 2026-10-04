import type { ReactNode } from "react";
import type { Language, LocalizedText } from "@/lib/language";
import type { EventKind } from "@/types/dashboard";
import type { RsvpPayload, TemplateFonts } from "@/types/invitation";

/**
 * The colours a palette sets, by name. On the page each is `--m-<role>`.
 * `canvas` is the ground around the invitation's column, `surface` the
 * page itself, `ink` its text; each accent has an `-ink` to write on it.
 * `surface-alt`, `ink-muted`, `line` and the two `-soft` tints are set too:
 * no mix matched the hand-picked colours, and they show everywhere.
 * `error` is the form's warnings, kept apart from the decorative accents so
 * a warning never reads as one more ornament.
 * More roles may come when a variant needs a colour no mix gives.
 */
export type ColorRole =
  | "canvas"
  | "surface"
  | "surface-alt"
  | "ink"
  | "ink-muted"
  | "line"
  | "accent"
  | "accent-ink"
  | "accent-soft"
  | "secondary"
  | "secondary-ink"
  | "secondary-soft"
  | "tertiary"
  | "tertiary-ink"
  | "error";

/**
 * Colours mixed from the roles in `vars.ts`, never set by a palette. Read
 * the same way: `--m-<name>`.
 */
export type MixedColor = "shadow" | "inverse" | "inverse-ink";

/** A premade palette. Hosts pick a whole one, never a single colour. */
export interface ModularPalette {
  id: string;
  name: string;
  colors: Record<ColorRole, string>;
}

/**
 * A pattern drawn on the invitation's ground (`--m-canvas`), in palette roles
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
  /** Each face's own name, as the Design tab shows it set in that face. */
  faceNames: { primary: string; secondary: string };
}

/**
 * `image` holds a path to a photo (no uploads yet — the sample photo is the
 * value); `icon` holds an id from `ICONS` in `src/modular/icons.tsx`.
 */
export type ScalarFieldType = "text" | "longText" | "time" | "image" | "icon";

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

/**
 * A list of groups, each with its own fields and a list inside it — a
 * schedule's days, each with its events.
 */
export interface GroupListField {
  id: string;
  label: LocalizedText;
  type: "groups";
  maxGroups: number;
  /** The group's own fields: a day's label. */
  group: ItemField[];
  /** The list inside each group: a day's events. */
  items: { label: LocalizedText; maxItems: number; item: ItemField[] };
  fallback: {
    values: Record<string, LocalizedText>;
    items: Record<string, LocalizedText>[];
  }[];
}

/** An on/off switch: show a part of the section or leave it out. */
export interface ToggleField {
  id: string;
  label: LocalizedText;
  type: "toggle";
  fallback: boolean;
}

/** One way to draw a section: `sections/<section>/<id>.tsx`. */
export interface VariantInfo {
  /** Permanent — events store it. */
  id: string;
  /** What the host's variant picker calls it. */
  name: LocalizedText;
}

export type SectionField =
  ScalarField | ToggleField | ListField | GroupListField;

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
  /**
   * Shown as a link in the top bar and the mobile drawer when present.
   * Sections given the very same label object share one link, to the first
   * of them on the page (`GOOD_TO_KNOW`).
   */
  menuLabel?: LocalizedText;
  /**
   * Other sections whose values this one shows, by id — so content entered
   * once is read in both places (the footer's mark is the top bar's).
   * Read from the state whether or not those sections are on.
   */
  reads?: string[];
  /**
   * How the page picks the section's ground. Left out, it takes the next of
   * the two surfaces in turn. `own`: it draws its own colour (a photo, an
   * accent band) and the turns carry on past it. `joined`: the same ground
   * as the section before, so the two read as one band.
   */
  ground?: "own" | "joined";
  /**
   * Its variants, each a file beside this one. The first is the default for
   * a section a template leaves off. Listed here so the editor can name them
   * without loading their code.
   */
  variants: VariantInfo[];
  fields: SectionField[];
}

/** The two surfaces sections and cards take turns on. */
export type Ground = "surface" | "surface-alt";

/** A section folder's `index.ts`. */
export interface SectionModule {
  section: SectionDefinition;
}

/** One list item's values, keyed by `ItemField.id`. */
export type ListItem = Record<string, string>;

/** One group of a `groups` field: its own values and its items. */
export interface Group {
  values: ListItem;
  items: ListItem[];
}

/** A section's content, already in the language it is read in. */
export type SectionValues = Record<
  string,
  string | boolean | ListItem[] | Group[]
>;

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
  /** The values of the sections this one `reads`, by id. */
  related: Partial<Record<string, SectionValues>>;
  /** The surface the page gave this section; its cards take the other one. */
  ground: Ground;
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
 * ground pattern and the sections with a variant for each. The page puts
 * them in each section's own `order`, not the order they are listed in.
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

/** What the editor edits and Save keeps: ids only, plus every section's values. */
export interface ModularState {
  palette: string;
  fontPair: string;
  /** No pattern: a plain ground. */
  pattern: string | null;
  /**
   * Every section in the library, in the fixed order. Kept as a list, with
   * its order, so rearranging can come later.
   */
  sections: SectionState[];
  /**
   * Every section's values in the invitation's language, on or off: turning
   * a section off only hides it.
   */
  values: Record<string, SectionValues>;
}

export interface SectionState {
  section: string;
  variant: string;
  /** Always true for a required section. */
  on: boolean;
}

/** Everything a modular invitation can be made from, as the editor lists it. */
export interface ModularLibrary {
  palettes: ModularPalette[];
  fontPairs: FontPair[];
  patterns: ModularPattern[];
  /** In their fixed `order`. */
  sections: SectionDefinition[];
  templates: ModularTemplate[];
}

/** A state with its ids resolved — what the page draws from. */
export interface ModularDesign {
  palette: ModularPalette;
  fontPair: FontPair;
  pattern: ModularPattern | null;
  /** Only the sections that are on, in order. */
  sections: { definition: SectionDefinition; variant: string }[];
  /** Every section's values, on or off — a section may read one that is off. */
  values: Record<string, SectionValues>;
}
