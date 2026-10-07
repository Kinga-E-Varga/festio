import type { ReactNode } from "react";
import type { Language, LocalizedText } from "@/lib/language";
import type { CornersId } from "@/modular/corners";
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
export type MixedColor =
  | "shadow"
  | "pattern"
  | "inverse"
  | "inverse-ink"
  | "accent-ink-muted"
  | "tertiary-ink-muted"
  | "page-ink"
  | "page-ink-muted"
  | "page-secondary"
  | "page-accent";

/**
 * How much colour a palette carries: `subtle` greyed-down and quiet,
 * `balanced` clear but softened, `vivid` saturated and bright. Ids are
 * permanent.
 */
export type PaletteMood = "subtle" | "balanced" | "vivid";

/** A premade palette. Hosts pick a whole one, never a single colour. */
export interface ModularPalette {
  id: string;
  name: string;
  mood: PaletteMood;
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
 * value); `icon` holds an id from `ICONS` in `src/modular/icons.tsx`; `date`
 * holds an ISO `YYYY-MM-DD` day, written out by the variant in one fixed way;
 * `lines` holds short lines joined by `\n` (a course's dishes), each line its
 * own input in the Content tab; `color` holds a hex colour or a palette
 * role's id ("accent"), picked with a colour picker.
 */
export type ScalarFieldType =
  "text" | "longText" | "time" | "date" | "image" | "icon" | "lines" | "color";

/** One field inside a list item — what a repeated group is made of. */
export interface ItemField {
  id: string;
  /** What the host's edit form calls it. Host chrome: the host's locale. */
  label: LocalizedText;
  type: ScalarFieldType;
  /** For `lines`, each line's limit. */
  maxLength: number;
  /** The host must fill it in: Save waits until it is. */
  required?: boolean;
  /** `lines` only: Add stops here. 1 edits the first line alone. */
  maxLines?: number;
  /** `lines` only: Add's own words ("add title"). */
  addLabel?: LocalizedText;
}

/** A single host-editable value. Its sample lives in `DEFAULTS`. */
export type ScalarField = ItemField;

/**
 * A repeating group: schedule items, FAQ entries, menu courses… Each item
 * holds one value per `item` field.
 */
export interface ListField {
  id: string;
  label: LocalizedText;
  type: "list";
  /** One item's name, numbered in the Content tab ("location 1"). Left out: the list's name and a number. */
  itemLabel?: LocalizedText;
  /** Add's own words ("add new location"). Left out: just "Add". */
  addLabel?: LocalizedText;
  maxItems: number;
  /** Remove stops here. Left out: the list may be empty. */
  minItems?: number;
  item: ItemField[];
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
  /** One group's name, numbered in the Content tab ("day 1"). */
  groupLabel: LocalizedText;
  /** Add's own words for a new group ("add new day"). */
  addLabel: LocalizedText;
  /** The group's own fields: a day's date. */
  group: ItemField[];
  /** The list inside each group: a day's events, each item numbered by `itemLabel` ("event 1"). */
  items: {
    label: LocalizedText;
    itemLabel: LocalizedText;
    /** Add's own words, `{n}` the group's number ("add event to day {n}"). */
    addLabel: LocalizedText;
    maxItems: number;
    item: ItemField[];
  };
}

/** An on/off switch: show a part of the section or leave it out. */
export interface ToggleField {
  id: string;
  label: LocalizedText;
  type: "toggle";
  /**
   * The fields it turns on and off. The Content tab draws these right
   * after it, only while it is on.
   */
  controls?: string[];
}

/** One option picked from a short list (a dropdown); the value is the option's id. */
export interface ChoiceField {
  id: string;
  label: LocalizedText;
  type: "choice";
  /** Ids are stored, so never renamed or reused. */
  options: { id: string; label: LocalizedText }[];
}

/**
 * The event's date, read-only: it is set in the event details, so the
 * field stores nothing.
 */
export interface EventDateField {
  id: string;
  label: LocalizedText;
  type: "eventDate";
}

/**
 * How the event's date is written: an id from `DATE_FORMATS`, its options
 * the real date in each style.
 */
export interface DateFormatField {
  id: string;
  label: LocalizedText;
  type: "dateFormat";
}

/** One way to draw a section: `sections/<section>/<id>.tsx`. */
export interface VariantInfo {
  /**
   * A number, counted up within the section ("1", "2"…). Permanent — events
   * store it — and never reused, even once its variant is gone. It is also
   * the file's name, so the file is never renamed; the name may change.
   */
  id: string;
  /** What the host's variant picker calls it. */
  name: LocalizedText;
  /** This variant's own ground rule, over the section's. */
  ground?: GroundRule;
  /**
   * The fields this variant draws, as paths: a field's id, `list.item` for a
   * list's item field, `groups.field` and `groups.items.field` for a groups
   * field. The Content tab shows only these; values it leaves out are kept.
   */
  shows: string[];
}

export type SectionField =
  | ScalarField
  | ToggleField
  | ChoiceField
  | EventDateField
  | DateFormatField
  | ListField
  | GroupListField;

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
  /** Header, cover, title, date, location and RSVP are always on. */
  required: boolean;
  /** The section's place in the fixed order: header 0, cover 10, title 20… */
  order: number;
  /**
   * Shown as a link in the header and the mobile drawer when present.
   * Sections given the very same label object share one link, to the first
   * of them on the page (`GOOD_TO_KNOW`).
   */
  menuLabel?: LocalizedText;
  /**
   * Other sections whose values this one shows, by id — so content entered
   * once is read in both places (the footer's mark is the header's).
   * Read from the state whether or not those sections are on.
   */
  reads?: string[];
  /**
   * What its card draws inside Helpful notes (Dress code, Gifts), as
   * `shows` paths: the fields the Content tab offers there.
   */
  noteCard?: string[];
  /** How the page picks the section's ground; a variant may set its own. */
  ground?: GroundRule;
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

/** What the page gives a section: a surface, or the accent band. */
export type SectionGround = Ground | "accent";

/**
 * How the page picks a section's ground. Left out, it takes the next of the
 * two surfaces in turn. `own`: it draws its own colour (a photo). `accent`:
 * it is an accent band. After either, the turns start again at `surface`.
 * `joined`: the same ground as the section right before, whatever it is, so
 * the two read as one band.
 */
export type GroundRule = "own" | "accent" | "joined";

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
 * Facts several sections show, entered once: the date. Phase 1 has no
 * event, so it comes from `DEFAULT_BASICS`. The locations are the location
 * section's own.
 */
export interface InvitationBasics {
  /** ISO `YYYY-MM-DD`. */
  date: string;
}

/** A section with a menu label, as the header and the drawer link it. */
export interface MenuLink {
  id: string;
  label: string;
}

/** What the header needs from the page around it. */
export interface BarNav {
  links: MenuLink[];
  menuOpen: boolean;
  onOpenMenu: () => void;
  /** The editor's Design and Content buttons, drawn inside the bar. */
  edit?: ReactNode;
}

export interface VariantProps {
  values: SectionValues;
  basics: InvitationBasics;
  /** The invitation's language — dates are written in it. */
  language: Language;
  /** The values of the sections this one `reads`, by id. */
  related: Partial<Record<string, SectionValues>>;
  /** The ground the page gave this section; its cards take the other surface. */
  ground: SectionGround;
  /** The RSVP variant hands the guest's reply up; every other one ignores it. */
  onRsvp?: (payload: RsvpPayload) => void;
  /** Only the header's variants read it. */
  nav?: BarNav;
}

/** A variant file: `sections/<section>/<id>.tsx`. */
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
  /** Left out: `DEFAULT_CORNERS`. */
  corners?: CornersId;
  sections: SectionChoice[];
  /**
   * Its own sample for some sections' fields, by section id, then field id
   * — `DEFAULTS` for the rest.
   */
  values?: Record<string, SectionSamples>;
}

/**
 * One field's sample, before it is read in a language: a plain value, a
 * toggle, a list's items or a `groups` field's groups.
 */
export type FieldSample =
  LocalizedText | boolean | Record<string, LocalizedText>[] | GroupSample[];

/** One group of a `groups` field's sample: its own values and its items. */
export interface GroupSample {
  values: Record<string, LocalizedText>;
  items: Record<string, LocalizedText>[];
}

/** A section's samples, by field id. */
export type SectionSamples = Record<string, FieldSample>;

export interface ModularTemplateModule {
  template: ModularTemplate;
}

/** What the editor edits and Save keeps: ids only, plus every section's values. */
export interface ModularState {
  palette: string;
  fontPair: string;
  /** No pattern: a plain ground. */
  pattern: string | null;
  /** A `CORNERS` id. */
  corners: string;
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
  corners: CornersId;
  /** Only the sections that are on, in order. */
  sections: { definition: SectionDefinition; variant: string }[];
  /** Every section's values, on or off — a section may read one that is off. */
  values: Record<string, SectionValues>;
}
