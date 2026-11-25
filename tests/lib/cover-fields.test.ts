import { expect, test } from "vitest";
import { contentParts } from "@/modular/fields";
import { sectionsOn } from "@/modular/state";
import { section as cover } from "@/modular/sections/cover";
import { section as date } from "@/modular/sections/date-time";
import type { ModularLibrary, ModularState } from "@/types/modular";

/*
 * Every cover draws the names and their lines itself, so they are the
 * Cover's own fields: its Content card offers what the chosen cover draws,
 * in the order it draws them, a Use names switch choosing between the
 * names and two plain lines.
 */
const LIBRARY = { sections: [cover, date] } as unknown as ModularLibrary;

function state(coverVariant: string, names = true, dateOn = true) {
  return {
    sections: [
      { section: "cover", variant: coverVariant, on: true },
      { section: "date-time", variant: "1", on: dateOn },
    ],
    values: { cover: { names } },
  } as unknown as ModularState;
}

function fields(coverVariant: string, names = true): string[] {
  return contentParts(
    state(coverVariant, names),
    LIBRARY,
    cover,
    coverVariant,
  ).flatMap((part) => part.fields.map(({ id }) => id));
}

test("Champagne's card offers the small line, the names and their line, then the details", () => {
  expect(fields("3")).toEqual([
    "eyebrow",
    "names",
    "namesStart",
    "namesMiddle",
    "namesEnd",
    "secondLine",
    "details",
  ]);
});

test("with Use names off, Champagne offers the two plain lines in the names' place", () => {
  expect(fields("3", false)).toEqual([
    "eyebrow",
    "names",
    "firstLine",
    "nextLine",
    "details",
  ]);
});

for (const [name, variant] of [
  ["Date block", "10"],
  ["Full centred", "11"],
]) {
  test(`${name}'s card offers the names and their line, then the details, the photo last`, () => {
    expect(fields(variant)).toEqual([
      "names",
      "namesStart",
      "namesMiddle",
      "namesEnd",
      "secondLine",
      "details",
      "photo",
    ]);
  });
}

test("Playbill's card offers its highlight right after the small line, the drawing last", () => {
  expect(fields("7")).toEqual([
    "eyebrow",
    "kicker",
    "names",
    "namesStart",
    "namesMiddle",
    "namesEnd",
    "details",
    "drawing",
  ]);
});

test("an unknown cover reads as the first, Date block", () => {
  expect(fields("1")).toEqual(fields("10"));
});

/* Every cover shows the date, so Date & time can be switched off. */
test("Date switched off is left out", () => {
  const ids = sectionsOn(state("10", true, false), LIBRARY).map(
    ({ definition }) => definition.id,
  );
  expect(ids).toEqual(["cover"]);
});
