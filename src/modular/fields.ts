import { localized, type Language } from "@/lib/language";
import { groups, isOn, list, text } from "./content";
import { DEFAULT_ICON } from "./icons";
import { NOTE_KINDS } from "./notes";
import {
  NOTES_ID,
  TITLE_ID,
  noteSwitchOn,
  sectionsOn,
  variantInfo,
} from "./state";
import type {
  ItemField,
  ListField,
  ListItem,
  ModularLibrary,
  ModularState,
  SectionDefinition,
  SectionField,
  SectionValues,
} from "@/types/modular";

/** Whether a section has anything for the host to edit: the Content tab leaves it out if not. */
export function hasContent(definition: SectionDefinition): boolean {
  return definition.fields.length > 0;
}

/** What `variant` draws; an id the section does not list reads as its first. */
function variantShows(
  definition: SectionDefinition,
  variant: string,
): Set<string> {
  const info = variantInfo(definition, variant);
  return showsOf(info, info.shows);
}

/*
 * Each `shows` list as a Set, built once per owner (a variant, a section's
 * Helpful notes card): the same Set every render, so the Content tab's rows
 * can tell nothing changed. Never changed after.
 */
const SHOWS = new WeakMap<object, Set<string>>();

function showsOf(owner: object, paths: readonly string[]): Set<string> {
  let shows = SHOWS.get(owner);
  if (!shows) {
    shows = new Set(paths);
    SHOWS.set(owner, shows);
  }
  return shows;
}

/** A list or groups field is shown when any of its parts is. */
function fieldShown(shows: Set<string>, field: SectionField): boolean {
  if (field.type === "list" || field.type === "groups") {
    return [...shows].some((path) => path.startsWith(`${field.id}.`));
  }
  return shows.has(field.id);
}

/**
 * The item fields shown under `prefix` (`venues`, `days`, `days.items`). A
 * `lines` field shown as `<path>.first` — the variant draws its first line
 * only — comes back as a single line.
 */
export function shownItems(
  shows: Set<string>,
  prefix: string,
  fields: ItemField[],
): ItemField[] {
  // Kept, like the Sets: the same list every render for the same question.
  const byFields = SHOWN.get(shows) ?? new WeakMap();
  SHOWN.set(shows, byFields);
  const byPrefix = byFields.get(fields) ?? new Map<string, ItemField[]>();
  byFields.set(fields, byPrefix);
  const kept = byPrefix.get(prefix);
  if (kept) return kept;
  const shown = fields.flatMap((field) => {
    const path = `${prefix}.${field.id}`;
    if (shows.has(path)) return [field];
    return shows.has(`${path}.first`) ? [{ ...field, maxLines: 1 }] : [];
  });
  byPrefix.set(prefix, shown);
  return shown;
}

const SHOWN = new WeakMap<
  Set<string>,
  WeakMap<ItemField[], Map<string, ItemField[]>>
>();

/** One section's field set to `value`; every other value stays as it is. */
export function setValue(
  state: ModularState,
  section: string,
  field: string,
  value: SectionValues[string],
): ModularState {
  return {
    ...state,
    values: {
      ...state.values,
      [section]: { ...(state.values[section] ?? {}), [field]: value },
    },
  };
}

/** A field's element id in the Content tab: `content-location-venues-0-label`. */
export function fieldId(section: string, ...parts: (string | number)[]) {
  return ["content", section, ...parts].join("-");
}

/** A new item: every field there, every value empty but an icon (`DEFAULT_ICON`). */
export function emptyItem(fields: ItemField[]): ListItem {
  return Object.fromEntries(
    fields.map(({ id, type }) => [id, type === "icon" ? DEFAULT_ICON : ""]),
  );
}

/** A list item's title in the host's language: its item label and number ("location 2"), or the list's label without one. */
export function itemTitle(field: ListField, n: number, host: Language): string {
  return field.itemLabel
    ? `${localized(field.itemLabel, host)} ${n}`
    : `${localized(field.label, host)} ${n}`;
}

/** `list` with the item at `index` replaced by `value`. */
export function replaceAt<T>(list: T[], index: number, value: T): T[] {
  return list.map((each, at) => (at === index ? value : each));
}

/** `list` without the item at `index`. */
export function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, at) => at !== index);
}

/**
 * What a switch hides as it stands: its `controls` while off, its
 * `controlsOff` while on. Not a switch: nothing.
 */
function switchedOff(field: SectionField, values: SectionValues): string[] {
  if (field.type !== "toggle") return [];
  return isOn(values, field.id)
    ? (field.controlsOff ?? [])
    : (field.controls ?? []);
}

/**
 * The fields on screen: those the variant shows, less the ones a switch
 * hides as it stands. A switch the variant hides leaves its fields alone.
 */
export function visibleFields(
  fields: SectionField[],
  shows: Set<string>,
  values: SectionValues,
): SectionField[] {
  const shown = fields.filter((field) => fieldShown(shows, field));
  const off = new Set(shown.flatMap((field) => switchedOff(field, values)));
  return shown.filter((field) => !off.has(field.id));
}

/**
 * `shows` less the item paths (`venues.photo`) a switch hides as it stands:
 * the same Set each time for the same switches, like `showsOf`.
 */
function visibleShows(
  fields: SectionField[],
  shows: Set<string>,
  values: SectionValues,
): Set<string> {
  const off = fields.flatMap((field) =>
    shows.has(field.id)
      ? switchedOff(field, values).filter((path) => shows.has(path))
      : [],
  );
  if (off.length === 0) return shows;
  const byOff = LESS.get(shows) ?? new Map<string, Set<string>>();
  LESS.set(shows, byOff);
  const key = off.join(" ");
  let less = byOff.get(key);
  if (!less) {
    less = new Set([...shows].filter((path) => !off.includes(path)));
    byOff.set(key, less);
  }
  return less;
}

const LESS = new WeakMap<Set<string>, Map<string, Set<string>>>();

/**
 * What Dress code and Gifts show inside Helpful notes: their card's fields,
 * the icon only where the notes' style draws icons (`items.icon`). The
 * card list itself owns the set without the icon.
 */
function twinShows(
  twin: SectionDefinition,
  notesShows: Set<string>,
): Set<string> {
  const paths = twin.noteCard ?? [];
  if (notesShows.has("items.icon")) return showsOf(twin, paths);
  return showsOf(
    paths,
    paths.filter((path) => path !== "icon"),
  );
}

/**
 * One block of fields in a section's Content card. Its values are
 * `section`'s — Helpful notes edits Dress code's and Gifts' as theirs.
 * `keep` limits a list to some of its items (Helpful notes' custom notes).
 */
export interface FieldPart {
  section: string;
  shows: Set<string>;
  fields: SectionField[];
  keep?: (item: ListItem) => boolean;
}

/**
 * Everything a section's Content card shows, block by block, in order —
 * what the card draws and what Save checks, so the two never disagree.
 * Helpful notes: its own fields, then Dress code and Gifts while switched
 * on here, then the custom notes while Custom is on.
 */
export function contentParts(
  state: ModularState,
  library: ModularLibrary,
  definition: SectionDefinition,
  variant: string,
): FieldPart[] {
  const shows = variantShows(definition, variant);
  const values = state.values[definition.id] ?? {};
  if (definition.id !== NOTES_ID) {
    const fields = visibleFields(definition.fields, shows, values);
    /* A poster cover's own fields follow the Title's, as it draws them. */
    return [
      ...posterPart(state, library, definition, variant),
      {
        section: definition.id,
        shows: visibleShows(definition.fields, shows, values),
        fields,
      },
    ];
  }
  const own = definition.fields.filter((field) => field.type !== "list");
  const parts: FieldPart[] = [
    {
      section: NOTES_ID,
      shows,
      fields: visibleFields(own, shows, values),
    },
  ];
  for (const kind of NOTE_KINDS) {
    if (!noteSwitchOn(state, kind)) continue;
    if (kind === "custom") {
      const items = definition.fields.filter(
        (field) => field.type === "list" && fieldShown(shows, field),
      );
      parts.push({
        section: NOTES_ID,
        shows,
        fields: items,
        keep: (item) => item.kind === "custom",
      });
      continue;
    }
    const twin = library.sections.find(({ id }) => id === kind);
    if (!twin) continue;
    const twinOnly = twinShows(twin, shows);
    parts.push({
      section: kind,
      shows: twinOnly,
      fields: visibleFields(twin.fields, twinOnly, state.values[kind] ?? {}),
    });
  }
  return parts;
}

/** A poster cover's Title fields, edited as the Title's: none for any other variant. */
function posterPart(
  state: ModularState,
  library: ModularLibrary,
  definition: SectionDefinition,
  variant: string,
): FieldPart[] {
  const paths = variantInfo(definition, variant).poster;
  const title = library.sections.find(({ id }) => id === TITLE_ID);
  if (!paths || !title) return [];
  const shows = showsOf(paths, paths);
  const values = state.values[TITLE_ID] ?? {};
  return [
    {
      section: TITLE_ID,
      shows: visibleShows(title.fields, shows, values),
      fields: visibleFields(title.fields, shows, values),
    },
  ];
}

/** An empty required field: the section card it is in, and its element id. */
interface FieldRef {
  section: string;
  id: string;
}

function blank(value: string | undefined): boolean {
  return !value?.trim();
}

/** The first required field of one item left empty. */
function emptyIn(fields: ItemField[], item: ListItem): ItemField | undefined {
  return fields.find((field) => field.required && blank(item[field.id]));
}

/** The element id of the first required field one part leaves empty. */
function missingIn(part: FieldPart, values: SectionValues): string | null {
  const { section, shows, fields, keep } = part;
  for (const field of fields) {
    if (field.type === "list") {
      const wanted = shownItems(shows, field.id, field.item);
      for (const [index, item] of list(values, field.id).entries()) {
        if (keep && !keep(item)) continue;
        const empty = emptyIn(wanted, item);
        if (empty) return fieldId(section, field.id, index, empty.id);
      }
      continue;
    }
    if (field.type === "groups") {
      const own = shownItems(shows, field.id, field.group);
      const inner = shownItems(shows, `${field.id}.items`, field.items.item);
      for (const [g, group] of groups(values, field.id).entries()) {
        const empty = emptyIn(own, group.values);
        if (empty) return fieldId(section, field.id, g, empty.id);
        for (const [index, item] of group.items.entries()) {
          const missing = emptyIn(inner, item);
          if (missing) {
            return fieldId(section, field.id, g, "items", index, missing.id);
          }
        }
      }
      continue;
    }
    if (
      "required" in field &&
      field.required &&
      blank(text(values, field.id))
    ) {
      return fieldId(section, field.id);
    }
  }
  return null;
}

/**
 * The first required field left empty, in page order: only sections that
 * are on, only fields their Content card shows.
 */
export function firstMissing(
  state: ModularState,
  library: ModularLibrary,
): FieldRef | null {
  for (const { definition, variant } of sectionsOn(state, library)) {
    for (const part of contentParts(state, library, definition, variant)) {
      const id = missingIn(part, state.values[part.section] ?? {});
      if (id) return { section: definition.id, id };
    }
  }
  return null;
}
