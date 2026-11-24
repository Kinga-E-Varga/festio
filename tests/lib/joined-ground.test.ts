import { expect, test } from "vitest";
import { sectionGrounds } from "@/modular/ground";
import { section as cover } from "@/modular/sections/cover";
import { section as textbox } from "@/modular/sections/textbox";
import { section as date } from "@/modular/sections/date-time";
import type { SectionDefinition } from "@/types/modular";

/*
 * A joined section (Text box `5`, Simple joined) takes the background of the
 * section right before it. After a cover, that is the cover's: Champagne's
 * accent band (`3`), or the page's surface behind a photo (Centred, `11`). The
 * section after the joined one (Date `8`, no rule of its own) stays apart.
 */
function grounds(...sections: [SectionDefinition, string][]) {
  return sectionGrounds(
    sections.map(([definition, variant]) => ({ definition, variant })),
  );
}

test("after Champagne, a joined text box is on the accent and the Date on the surface", () => {
  expect(grounds([cover, "3"], [textbox, "5"], [date, "8"])).toEqual([
    "accent",
    "accent",
    "surface",
  ]);
});

test("after a photo cover, a joined text box is on the surface and the Date on the other one", () => {
  expect(grounds([cover, "11"], [textbox, "5"], [date, "8"])).toEqual([
    "surface",
    "surface",
    "surface-alt",
  ]);
});
