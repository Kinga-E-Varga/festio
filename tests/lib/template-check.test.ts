import { expect, test, vi } from "vitest";
import { loadLibrary } from "@/modular";

/* The font pairs load their faces through `next/font`, which only runs in Next; the check needs their ids alone. */
vi.mock("@/lib/fonts", () => ({
  fonts: new Proxy({}, { get: () => ({ variable: "", style: {} }) }),
}));
import { templateProblems } from "@/modular/check";
import type { ModularTemplate, SectionDefinition } from "@/types/modular";

/*
 * A made-up library: palette "p", font pair "f", pattern "dots", and one
 * section "s" with variants "1" (the heading alone) and "2" (everything), a
 * heading, a list of places (each a name) and groups of days (each a date,
 * with items that have a time). "s" reads section "r" (as Helpful notes
 * reads Dress code), which has a heading and is never on itself.
 */
const LABEL = { en: "x", ro: "x", hu: "x" };
const SECTION: SectionDefinition = {
  id: "s",
  name: LABEL,
  required: false,
  order: 0,
  variants: [
    { id: "1", name: LABEL, shows: ["heading"] },
    {
      id: "2",
      name: LABEL,
      shows: ["heading", "places.name", "days.date", "days.items.time"],
    },
  ],
  reads: ["r"],
  fields: [
    { id: "heading", label: LABEL, type: "text", maxLength: 10 },
    {
      id: "places",
      label: LABEL,
      type: "list",
      maxItems: 3,
      item: [{ id: "name", label: LABEL, type: "text", maxLength: 10 }],
    },
    {
      id: "days",
      label: LABEL,
      type: "groups",
      maxGroups: 2,
      groupLabel: LABEL,
      addLabel: LABEL,
      group: [{ id: "date", label: LABEL, type: "text", maxLength: 10 }],
      items: {
        label: LABEL,
        itemLabel: LABEL,
        addLabel: LABEL,
        maxItems: 3,
        item: [{ id: "time", label: LABEL, type: "text", maxLength: 10 }],
      },
    },
  ],
};
const READ: SectionDefinition = {
  id: "r",
  name: LABEL,
  required: false,
  order: 1,
  variants: [{ id: "1", name: LABEL, shows: ["heading"] }],
  fields: [{ id: "heading", label: LABEL, type: "text", maxLength: 10 }],
};
const OTHER: SectionDefinition = { ...READ, id: "o", order: 2 };
const LIBRARY = {
  palettes: [{ id: "p" }],
  fontPairs: [{ id: "f" }],
  patterns: [{ id: "dots" }],
  sections: [SECTION, READ, OTHER],
};

const GOOD: ModularTemplate = {
  kind: "modular",
  id: "good",
  name: "Good",
  package: "custom",
  eventTypes: ["wedding"],
  palette: "p",
  fontPair: "f",
  pattern: "dots",
  corners: "round",
  sections: [{ section: "s", variant: "2" }],
  values: {
    s: {
      heading: "Hi",
      places: [{ name: "Here" }],
      days: [{ values: { date: "2027-01-01" }, items: [{ time: "10:00" }] }],
    },
    // Not on, but "s" reads it.
    r: { heading: "Hi" },
  },
};

test("a template whose every id and key exists has no problems", () => {
  expect(templateProblems(GOOD, LIBRARY)).toEqual([]);
});

test("a missing palette, font pair, pattern or corners step is named", () => {
  const template = {
    ...GOOD,
    palette: "gone-palette",
    fontPair: "gone-pair",
    pattern: "gone-pattern",
    corners: "gone-corners",
  } as unknown as ModularTemplate;
  expect(templateProblems(template, LIBRARY)).toEqual([
    'palette "gone-palette" not found',
    'font pair "gone-pair" not found',
    'pattern "gone-pattern" not found',
    'corners "gone-corners" not found',
  ]);
});

test("no pattern and no corners are allowed", () => {
  const template = { ...GOOD, pattern: undefined, corners: undefined };
  expect(templateProblems(template, LIBRARY)).toEqual([]);
});

test("a missing section, a missing variant and a section listed twice are named", () => {
  const template: ModularTemplate = {
    ...GOOD,
    sections: [
      { section: "s", variant: "9" },
      { section: "gone", variant: "1" },
      { section: "s", variant: "1" },
    ],
  };
  expect(templateProblems(template, LIBRARY)).toEqual([
    'section "s": variant "9" not found',
    'section "gone" not found',
    'section "s" listed twice',
  ]);
});

test("a values key that is no section or no field is named, down to list and group items", () => {
  const template: ModularTemplate = {
    ...GOOD,
    values: {
      gone: { heading: "Hi" },
      s: {
        title: "Old",
        places: [{ name: "Here", city: "Old" }],
        days: [
          {
            values: { date: "2027-01-01", label: "Old" },
            items: [{ time: "10:00", note: "Old" }],
          },
        ],
      },
    },
  };
  expect(templateProblems(template, LIBRARY)).toEqual([
    'values: section "gone" not found',
    'values "s": field "title" not found',
    'values "s": field "places.city" not found',
    'values "s": field "days.label" not found',
    'values "s": field "days.items.note" not found',
  ]);
});

test("a value its section's style doesn't show, or a section not on, is named", () => {
  const template: ModularTemplate = {
    ...GOOD,
    sections: [{ section: "s", variant: "1" }],
    values: {
      ...GOOD.values,
      o: { heading: "Hi" },
    },
  };
  expect(templateProblems(template, LIBRARY)).toEqual([
    'values "s": field "places" not shown by variant "1"',
    'values "s": field "days" not shown by variant "1"',
    'values: section "o" is not on',
  ]);
});

test("a read section's values are named once no section on reads it", () => {
  const template: ModularTemplate = {
    ...GOOD,
    sections: [{ section: "o", variant: "1" }],
    values: { r: { heading: "Hi" } },
  };
  expect(templateProblems(template, LIBRARY)).toEqual([
    'values: section "r" is not on',
  ]);
});

test("every modular template matches the library", () => {
  const library = loadLibrary();
  const problems = library.templates.flatMap((template) =>
    templateProblems(template, library).map(
      (problem) => `${template.id}: ${problem}`,
    ),
  );
  expect(problems).toEqual([]);
});
