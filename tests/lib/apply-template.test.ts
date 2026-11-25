import { expect, test } from "vitest";
import { applyTemplate, initialState } from "@/modular/state";
import type {
  ModularLibrary,
  ModularState,
  ModularTemplate,
  SectionDefinition,
  SectionValues,
} from "@/types/modular";

/*
 * Two made-up optional sections. "s" has styles "a" and "b", both showing a
 * heading, a note and a list of places (each a name). "t" has one style and
 * a heading. Neither has `DEFAULTS`, so a template's samples are all there is.
 */
const LABEL = { en: "x", ro: "x", hu: "x" };
const SHOWS = ["heading", "note", "places.name"];
const S: SectionDefinition = {
  id: "s",
  name: LABEL,
  required: false,
  order: 0,
  variants: [
    { id: "a", name: LABEL, shows: SHOWS },
    { id: "b", name: LABEL, shows: SHOWS },
  ],
  fields: [
    { id: "heading", label: LABEL, type: "text", maxLength: 40 },
    { id: "note", label: LABEL, type: "text", maxLength: 40 },
    {
      id: "places",
      label: LABEL,
      type: "list",
      maxItems: 3,
      item: [{ id: "name", label: LABEL, type: "text", maxLength: 40 }],
    },
  ],
};
const T: SectionDefinition = {
  id: "t",
  name: LABEL,
  required: false,
  order: 1,
  variants: [{ id: "1", name: LABEL, shows: ["heading"] }],
  fields: [{ id: "heading", label: LABEL, type: "text", maxLength: 40 }],
};

const BASE = {
  kind: "modular" as const,
  package: "custom" as const,
  eventTypes: [],
};

/* The template the invitation started from: "s" on in style "a". */
const FROM: ModularTemplate = {
  ...BASE,
  id: "from",
  name: "From",
  palette: "p1",
  fontPair: "f1",
  sections: [{ section: "s", variant: "a" }],
  values: {
    s: {
      heading: "From heading",
      note: "From note",
      places: [{ name: "From place" }],
    },
    t: { heading: "From t" },
  },
};

/* The template picked next: another look, "s" in style "b", and "t" on too. */
const TO: ModularTemplate = {
  ...BASE,
  id: "to",
  name: "To",
  palette: "p2",
  fontPair: "f2",
  pattern: "dots",
  corners: "round",
  sections: [
    { section: "s", variant: "b" },
    { section: "t", variant: "1" },
  ],
  values: {
    s: {
      heading: "To heading",
      note: "To note",
      places: [{ name: "To place" }],
    },
    t: { heading: "To t" },
  },
};

/* "t" only: "s" goes off. */
const T_ONLY: ModularTemplate = {
  ...TO,
  id: "t-only",
  sections: [{ section: "t", variant: "1" }],
};

const LIBRARY: ModularLibrary = {
  palettes: [],
  fontPairs: [],
  patterns: [],
  sections: [S, T],
  templates: [FROM, TO, T_ONLY],
};

/* The invitation as started from FROM, with `values` over "s" and the envelope off. */
function edited(values: SectionValues): ModularState {
  const state = initialState(FROM, LIBRARY, "en");
  return {
    ...state,
    envelope: false,
    values: { ...state.values, s: { ...state.values.s, ...values } },
  };
}

function section(state: ModularState, id: string) {
  return state.sections.find(({ section }) => section === id);
}

test("the picked template's look and sections apply in full", () => {
  const next = applyTemplate(edited({}), FROM, TO, LIBRARY, "en");
  expect(next.palette).toBe("p2");
  expect(next.fontPair).toBe("f2");
  expect(next.pattern).toBe("dots");
  expect(next.corners).toBe("round");
  expect(section(next, "s")).toEqual({ section: "s", variant: "b", on: true });
  expect(section(next, "t")).toEqual({ section: "t", variant: "1", on: true });
});

test("a section the picked template doesn't list goes off", () => {
  const next = applyTemplate(edited({}), FROM, T_ONLY, LIBRARY, "en");
  expect(section(next, "s")?.on).toBe(false);
});

test("untouched values take the picked template's", () => {
  const next = applyTemplate(edited({}), FROM, TO, LIBRARY, "en");
  expect(next.values.s).toEqual({
    heading: "To heading",
    note: "To note",
    places: [{ name: "To place" }],
  });
  expect(next.values.t).toEqual({ heading: "To t" });
});

test("the host's own text stays, a list whole", () => {
  const next = applyTemplate(
    edited({ note: "Our note", places: [{ name: "Our place" }] }),
    FROM,
    TO,
    LIBRARY,
    "en",
  );
  expect(next.values.s).toEqual({
    heading: "To heading",
    note: "Our note",
    places: [{ name: "Our place" }],
  });
});

test("a field the host emptied stays empty", () => {
  const next = applyTemplate(edited({ heading: "" }), FROM, TO, LIBRARY, "en");
  expect(next.values.s.heading).toBe("");
});

test("the host's text stays in a section the picked template turns off", () => {
  const next = applyTemplate(
    edited({ note: "Our note" }),
    FROM,
    T_ONLY,
    LIBRARY,
    "en",
  );
  expect(next.values.s.note).toBe("Our note");
  expect(next.values.s.heading).toBe("To heading");
});

test("the envelope stays as the host left it", () => {
  const next = applyTemplate(edited({}), FROM, TO, LIBRARY, "en");
  expect(next.envelope).toBe(false);
});

test("without the template it started from, every value counts as the host's", () => {
  const next = applyTemplate(
    edited({ note: "Our note" }),
    undefined,
    TO,
    LIBRARY,
    "en",
  );
  expect(next.palette).toBe("p2");
  expect(section(next, "t")?.on).toBe(true);
  expect(next.values.s).toEqual({
    heading: "From heading",
    note: "Our note",
    places: [{ name: "From place" }],
  });
  expect(next.values.t).toEqual({ heading: "From t" });
});
