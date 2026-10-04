import type { Language } from "@/lib/language";
import { isOn, list, sectionValues } from "@/modular/content";
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
 * A template as a fresh state: its palette, pattern and pair, every library
 * section in order — on when the template lists it or it is required — with
 * the template's variant or the section's first, and every section's sample
 * values. A variant the section does not list falls back to its first.
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
        sectionValues(definition, language),
      ]),
    ),
  };
}

/** A template's look over the state: palette, pattern and pair only — sections stay as they are. */
export function applyTemplate(
  state: ModularState,
  template: ModularTemplate,
): ModularState {
  return {
    ...state,
    palette: template.palette,
    fontPair: template.fontPair,
    pattern: template.pattern ?? null,
  };
}

/**
 * Dress code and Gifts each have a standalone section and a Helpful notes
 * subsection of the same id; only one of the two is ever on.
 */
function isPaired(id: string): id is "dress-code" | "gifts" {
  return id === "dress-code" || id === "gifts";
}

/**
 * Turns an optional section on or off; its values stay either way. Dress
 * code or Gifts turned on switches its Helpful notes twin off.
 */
export function setSectionOn(
  state: ModularState,
  id: string,
  on: boolean,
): ModularState {
  const next = {
    ...state,
    sections: state.sections.map((section) =>
      section.section === id ? { ...section, on } : section,
    ),
  };
  return on && isPaired(id) && noteSwitchOn(next, id)
    ? setNoteSwitch(next, id, false, null)
    : next;
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
 * Helpful notes itself off. Dress code or Gifts turned on here switches the
 * standalone section off. Custom on with no custom
 * note left adds `sample` — the only time the Design tab adds a note — and
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
  let next: ModularState = {
    ...state,
    values: { ...state.values, [NOTES_ID]: values },
  };
  /* Dress code or Gifts here turned on switches its standalone twin off. */
  if (on && isPaired(kind)) next = setSectionOn(next, kind, false);
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

  const sections: ModularDesign["sections"] = [];
  for (const { section, variant, on } of state.sections) {
    if (!on) continue;
    const definition = library.sections.find(({ id }) => id === section);
    if (definition) sections.push({ definition, variant });
  }
  return { palette, fontPair, pattern, sections, values: state.values };
}

/**
 * Whether two states hold the same choices and values. Every update above
 * spreads the old object, so keys keep their order and JSON compares them.
 */
export function sameState(a: ModularState, b: ModularState): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
