import { expect, test } from "vitest";
import { visibleFields } from "@/modular/fields";
import { section as cover } from "@/modular/sections/cover";
import type { SectionValues } from "@/types/modular";

/* The couple's lines, and the two plain lines in their place. */
const NAMED = ["namesStart", "namesMiddle", "namesEnd", "secondLine"];
const PLAIN = ["firstLine", "nextLine"];

/* The Cover's fields on screen under Champagne (`3`), for the given values. */
function shown(values: SectionValues): string[] {
  const shows = new Set(
    cover.variants.find(({ id }) => id === "3")?.shows ?? [],
  );
  return visibleFields(cover.fields, shows, values).map(({ id }) => id);
}

test("with names on, the cover offers the names and their line, not the plain lines", () => {
  for (const values of [{}, { names: true }] as SectionValues[]) {
    const ids = shown(values);
    expect(ids).toEqual(expect.arrayContaining(NAMED));
    for (const id of PLAIN) expect(ids).not.toContain(id);
  }
});

test("with names off, the cover offers the two plain lines, not the names", () => {
  const ids = shown({ names: false });
  expect(ids).toEqual(expect.arrayContaining(PLAIN));
  for (const id of NAMED) expect(ids).not.toContain(id);
});
