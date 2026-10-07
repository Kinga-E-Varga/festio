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
  ListItem,
  ModularDesign,
  ModularLibrary,
  ModularState,
  ModularTemplate,
} from "@/types/modular";

/** Helpful notes' permanent id. */
export const NOTES_ID = "notes";

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
 * only. Sections and values stay as they are — a template's samples are
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

/** Picks a section's variant. Values belong to the section, so nothing is lost. */
export function setVariant(
  state: ModularState,
  id: string,
  variant: string,
): ModularState {
  return {
    ...state,
    sections: state.sections.map((section) =>
      section.section === id ? { ...section, variant } : section,
    ),
  };
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
 * that names nothing is left out.
 */
export function sectionsOn(
  state: ModularState,
  library: ModularLibrary,
): ModularDesign["sections"] {
  const sections: ModularDesign["sections"] = [];
  for (const { section, variant, on } of state.sections) {
    if (!on) continue;
    const definition = library.sections.find(({ id }) => id === section);
    if (definition) sections.push({ definition, variant });
  }
  return sections;
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
