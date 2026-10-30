import { expect, test } from "vitest";
import { contentParts } from "@/modular/fields";
import { isRequired, sectionsOn } from "@/modular/state";
import { section as cover } from "@/modular/sections/cover";
import { section as title } from "@/modular/sections/title";
import { section as date } from "@/modular/sections/date-time";
import type { ModularLibrary, ModularState } from "@/types/modular";

/*
 * A poster cover (Champagne, `3`) draws the Title's content itself: while it
 * is on, the Title is left out, and the Cover's Content card offers the
 * Title's fields as the Title's. A photo cover (Box, `1`) leaves the Title
 * as it is. Only the two sections matter here.
 */
const LIBRARY = { sections: [cover, title] } as unknown as ModularLibrary;

function state(coverVariant: string, names = true): ModularState {
  return {
    sections: [
      { section: "cover", variant: coverVariant, on: true },
      { section: "title", variant: "1", on: true },
    ],
    values: { cover: {}, title: { names } },
  } as unknown as ModularState;
}

function ids(coverVariant: string): string[] {
  return sectionsOn(state(coverVariant), LIBRARY).map(
    ({ definition }) => definition.id,
  );
}

function parts(coverVariant: string, names = true) {
  return contentParts(
    state(coverVariant, names),
    LIBRARY,
    cover,
    coverVariant,
  ).map(({ section, fields }) => ({
    section,
    fields: fields.map(({ id }) => id),
  }));
}

test("a poster cover leaves the Title out", () => {
  expect(ids("3")).toEqual(["cover"]);
});

test("a photo cover keeps the Title", () => {
  expect(ids("1")).toEqual(["cover", "title"]);
});

test("a poster cover's card offers the Title's fields, without the caption, then its own", () => {
  expect(parts("3")).toEqual([
    {
      section: "title",
      fields: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "secondLine",
      ],
    },
    { section: "cover", fields: ["details"] },
  ]);
});

test("with Use names off, the poster cover offers the two title lines", () => {
  expect(parts("3", false)).toEqual([
    { section: "title", fields: ["eyebrow", "names", "firstLine", "nextLine"] },
    { section: "cover", fields: ["details"] },
  ]);
});

test("a photo cover's card offers only its own fields", () => {
  expect(parts("1")).toEqual([
    { section: "cover", fields: ["photo", "kicker"] },
  ]);
});

/*
 * Date is required, but optional under a poster cover, which shows the
 * date itself. The host's off is kept: another cover draws Date again
 * without changing it.
 */
const WITH_DATE = {
  sections: [cover, title, date],
} as unknown as ModularLibrary;

function dateOff(coverVariant: string): string[] {
  const off = {
    sections: [
      { section: "cover", variant: coverVariant, on: true },
      { section: "title", variant: "1", on: true },
      { section: "date-time", variant: "1", on: false },
    ],
    values: {},
  } as unknown as ModularState;
  return sectionsOn(off, WITH_DATE).map(({ definition }) => definition.id);
}

test("under a poster cover, Date switched off is left out", () => {
  expect(dateOff("3")).toEqual(["cover"]);
});

test("with a photo cover, Date is drawn even if it was switched off", () => {
  expect(dateOff("1")).toEqual(["cover", "title", "date-time"]);
});

test("Date is optional only under a poster cover; the Title stays required", () => {
  expect(isRequired(date, true)).toBe(false);
  expect(isRequired(date, false)).toBe(true);
  expect(isRequired(title, true)).toBe(true);
});
