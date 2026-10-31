import { expect, test } from "vitest";
import { sectionGrounds } from "@/modular/ground";
import { section as cover } from "@/modular/sections/cover";
import { section as title } from "@/modular/sections/title";
import { section as date } from "@/modular/sections/date-time";
import { section as location } from "@/modular/sections/location";
import { section as schedule } from "@/modular/sections/schedule";
import type { SectionDefinition } from "@/types/modular";

/*
 * Location's Full card accent (`10`) always sits on the page's surface,
 * whatever its turn would be, and the section after it takes the other
 * one. Photo cover (Box, `1`), Title `1`, Date `8` and Schedule `1` take
 * their turns.
 */
function grounds(...sections: [SectionDefinition, string][]) {
  return sectionGrounds(
    sections.map(([definition, variant]) => ({ definition, variant })),
  );
}

test("in the surface-alt's turn, Full card accent is on the surface and the next on the other", () => {
  expect(
    grounds([cover, "1"], [title, "1"], [location, "10"], [schedule, "1"]),
  ).toEqual(["surface", "surface", "surface", "surface-alt"]);
});

test("in the surface's turn, Full card accent is on the surface and the next on the other", () => {
  expect(
    grounds(
      [cover, "1"],
      [title, "1"],
      [date, "8"],
      [location, "10"],
      [schedule, "1"],
    ),
  ).toEqual(["surface", "surface", "surface-alt", "surface", "surface-alt"]);
});
