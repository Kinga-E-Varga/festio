import type { Language } from "@/lib/language";
import { isOn, list } from "@/modular/content";
import { sectionValues } from "@/modular/samples";
import { DEFAULT_CORNERS, isCornersId } from "@/modular/corners";
import {
  MAX_NOTES,
  NOTE_KINDS,
  NOTE_SWITCH,
  type NoteKind,
} from "@/modular/notes";
import type {
  Group,
  ListItem,
  ModularDesign,
  ModularLibrary,
  ModularState,
  ModularTemplate,
  SectionDefinition,
  SectionValues,
} from "@/types/modular";

/** Helpful notes' permanent id. */
export const NOTES_ID = "notes";

/** The Title's permanent id: a poster cover takes its place. */
export const TITLE_ID = "title";

/**
 * A template as a fresh state: its palette, pattern, corners and pair,
 * every library section in order — on when the template lists it or it is
 * required — with the template's variant or the section's first, and every
 * section's sample values. A variant the section does not list falls back to its first.
 */
export function initialState(
  template: ModularTemplate,
  library: ModularLibrary,
  language: Language,
): ModularState {
  const picked = new Map(
    template.sections.map((choice) => [choice.section, choice.variant]),
  );
  return {
    palette: template.palette,
    fontPair: template.fontPair,
    pattern: template.pattern ?? null,
    corners: template.corners ?? DEFAULT_CORNERS,
    envelope: true,
    sections: library.sections.map((definition) => {
      const wanted = picked.get(definition.id);
      const known = definition.variants.some(({ id }) => id === wanted);
      return {
        section: definition.id,
        variant: known && wanted ? wanted : definition.variants[0].id,
        on: definition.required || picked.has(definition.id),
      };
    }),
    values: Object.fromEntries(
      library.sections.map((definition) => [
        definition.id,
        sectionValues(definition, language, template.values?.[definition.id]),
      ]),
    ),
  };
}

/**
 * A template's look over the state: palette, pattern, corners and pair
 * only. Sections, values and the envelope stay as they are — a template's samples are
 * copied once, by `initialState`, and after that only the host changes them.
 */
export function applyTemplate(
  state: ModularState,
  template: ModularTemplate,
): ModularState {
  return {
    ...state,
    palette: template.palette,
    fontPair: template.fontPair,
    pattern: template.pattern ?? null,
    corners: template.corners ?? DEFAULT_CORNERS,
  };
}

/**
 * Turns an optional section on or off; its values stay either way. Dress
 * code and Gifts may be on both standalone and in Helpful notes: a host
 * spots a repeat more easily than a part that quietly went off.
 */
export function setSectionOn(
  state: ModularState,
  id: string,
  on: boolean,
): ModularState {
  return {
    ...state,
    sections: state.sections.map((section) =>
      section.section === id ? { ...section, on } : section,
    ),
  };
}

/**
 * Picks a section's variant. Values belong to the section, so nothing is
 * lost. What the new variant shows and the old one did not, left empty,
 * gets its sample from `samples` (the section's, in the invitation's
 * language), so the host sees the whole variant and removes what they
 * don't want. What both show stays as the host left it; switches too.
 */
export function setVariant(
  state: ModularState,
  definition: SectionDefinition,
  variant: string,
  samples: SectionValues,
): ModularState {
  const id = definition.id;
  const from = state.sections.find(({ section }) => section === id)?.variant;
  const before = new Set(shownPaths(definition, from));
  const added = shownPaths(definition, variant).filter(
    (path) => !before.has(path),
  );
  let values = state.values[id] ?? {};
  for (const path of added)
    values = fillPath(definition, values, samples, path);
  return {
    ...state,
    sections: state.sections.map((section) =>
      section.section === id ? { ...section, variant } : section,
    ),
    values: { ...state.values, [id]: values },
  };
}

/** What a variant shows, `.first` dropped; an id the section does not list reads as its first. */
function shownPaths(definition: SectionDefinition, variant?: string) {
  const info =
    definition.variants.find(({ id }) => id === variant) ??
    definition.variants[0];
  return info.shows.map((path) => path.replace(/\.first$/, ""));
}

function blank(value: unknown): boolean {
  return (
    value === undefined ||
    (typeof value === "string" && !value.trim()) ||
    (Array.isArray(value) && value.length === 0)
  );
}

/** `item` with `key` from `sample` when it is empty there. */
function fillItem(item: ListItem, sample: ListItem | undefined, key: string) {
  return blank(item[key]) && sample?.[key] !== undefined
    ? { ...item, [key]: sample[key] }
    : item;
}

/**
 * One shown path filled from the samples where empty: a field, a list
 * item's (`venues.photo`), a group's (`days.label`) or a group item's
 * (`days.items.time`). Each item takes the sample at its own place, the
 * first one past the samples' end. An empty list takes the sample list.
 */
function fillPath(
  definition: SectionDefinition,
  values: SectionValues,
  samples: SectionValues,
  path: string,
): SectionValues {
  const [fieldId, ...rest] = path.split(".");
  const field = definition.fields.find(({ id }) => id === fieldId);
  const sample = samples[fieldId];
  if (!field || field.type === "toggle" || sample === undefined) return values;
  const value = values[fieldId];
  if (blank(value)) return { ...values, [fieldId]: sample };
  if (rest.length === 0 || !Array.isArray(value) || !Array.isArray(sample)) {
    return values;
  }
  if (field.type === "list") {
    const items = sample as ListItem[];
    const filled = (value as ListItem[]).map((item, at) =>
      fillItem(item, items[at] ?? items[0], rest[0]),
    );
    return { ...values, [fieldId]: filled };
  }
  if (field.type === "groups") {
    const groups = sample as Group[];
    const filled = (value as Group[]).map((group, g) => {
      const own = groups[g] ?? groups[0];
      if (rest[0] !== "items") {
        return {
          ...group,
          values: fillItem(group.values, own?.values, rest[0]),
        };
      }
      const items = own?.items ?? [];
      return {
        ...group,
        items: group.items.map((item, at) =>
          fillItem(item, items[at] ?? items[0], rest[1]),
        ),
      };
    });
    return { ...values, [fieldId]: filled };
  }
  return values;
}

function customNotes(state: ModularState): ListItem[] {
  return list(state.values[NOTES_ID] ?? {}, "items").filter(
    (item) => item.kind === "custom",
  );
}

/**
 * Whether a Helpful notes switch reads on. Custom reads off when no custom
 * note is left — the text editor deleting the last one turns it off.
 */
export function noteSwitchOn(state: ModularState, kind: NoteKind): boolean {
  const on = isOn(state.values[NOTES_ID] ?? {}, NOTE_SWITCH[kind]);
  return kind === "custom" ? on && customNotes(state).length > 0 : on;
}

/**
 * Flips one Helpful notes switch. Off only hides; the last one off turns
 * Helpful notes itself off. Custom on with no custom
 * note left adds `sample` — the only time a switch adds a note — and
 * never past `MAX_NOTES`.
 */
export function setNoteSwitch(
  state: ModularState,
  kind: NoteKind,
  on: boolean,
  sample: ListItem | null,
): ModularState {
  const values = { ...(state.values[NOTES_ID] ?? {}), [NOTE_SWITCH[kind]]: on };
  const items = list(values, "items");
  if (
    kind === "custom" &&
    on &&
    sample &&
    customNotes(state).length === 0 &&
    items.length < MAX_NOTES
  ) {
    values.items = [...items, sample];
  }
  const next: ModularState = {
    ...state,
    values: { ...state.values, [NOTES_ID]: values },
  };
  /* With nothing left to show, the section itself goes off too. */
  return NOTE_KINDS.some((each) => noteSwitchOn(next, each))
    ? next
    : setSectionOn(next, NOTES_ID, false);
}

/**
 * Turns Helpful notes on. Left with every subsection off, it would show only
 * its heading, so then all three come back on — Custom with `sample` if no
 * custom note is left.
 */
export function showNotes(
  state: ModularState,
  sample: ListItem | null,
): ModularState {
  const shown = setSectionOn(state, NOTES_ID, true);
  if (NOTE_KINDS.some((kind) => noteSwitchOn(shown, kind))) return shown;
  return NOTE_KINDS.reduce(
    (next, kind) => setNoteSwitch(next, kind, true, sample),
    shown,
  );
}

/**
 * The sections that are on, in page order, each with its definition; an id
 * that names nothing is left out, and so is the Title under a poster cover;
 * a required section is on whatever its switch says (`isRequired`).
 */
export function sectionsOn(
  state: ModularState,
  library: ModularLibrary,
): ModularDesign["sections"] {
  const sections: ModularDesign["sections"] = [];
  const poster = posterOn(state, library);
  for (const { section, variant, on } of state.sections) {
    if (poster && section === TITLE_ID) continue;
    const definition = library.sections.find(({ id }) => id === section);
    if (!definition || !(on || isRequired(definition, poster))) continue;
    sections.push({ definition, variant });
  }
  return sections;
}

/**
 * Whether the section is always on: required, unless a poster cover is on
 * and the section is optional there (Date). A required one is drawn even
 * if switched off under a poster, the host's off kept for the next one.
 */
export function isRequired(
  definition: SectionDefinition,
  poster: boolean,
): boolean {
  return definition.required && !(poster && definition.posterOptional);
}

/** `variant`'s entry in the section; an id the section does not list reads as its first. */
export function variantInfo(definition: SectionDefinition, variant: string) {
  return (
    definition.variants.find(({ id }) => id === variant) ??
    definition.variants[0]
  );
}

/**
 * Whether a poster cover is on, drawing the Title's content in its place:
 * the Title is then left off the page and the editor, its values kept.
 */
export function posterOn(
  state: ModularState,
  library: ModularLibrary,
): boolean {
  return state.sections.some(({ section, variant, on }) => {
    const definition = library.sections.find(({ id }) => id === section);
    return on && !!definition && !!variantInfo(definition, variant).poster;
  });
}

/** The state's ids looked up in the library; null when one names nothing. */
export function resolveDesign(
  state: ModularState,
  library: ModularLibrary,
): ModularDesign | null {
  const palette = library.palettes.find(({ id }) => id === state.palette);
  const fontPair = library.fontPairs.find(({ id }) => id === state.fontPair);
  const pattern = state.pattern
    ? (library.patterns.find(({ id }) => id === state.pattern) ?? null)
    : null;
  if (!palette || !fontPair) return null;
  const corners = isCornersId(state.corners) ? state.corners : DEFAULT_CORNERS;

  return {
    palette,
    fontPair,
    pattern,
    corners,
    envelope: state.envelope,
    sections: sectionsOn(state, library),
    values: state.values,
  };
}

/**
 * Whether two states hold the same choices and values. Every update above
 * spreads the old object, so keys keep their order and JSON compares them.
 */
export function sameState(a: ModularState, b: ModularState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
