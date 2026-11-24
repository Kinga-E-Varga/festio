import { expect, test } from "vitest";
import { sectionGrounds } from "@/modular/ground";
import { section as cover } from "@/modular/sections/cover";
import { section as date } from "@/modular/sections/date-time";
import { section as schedule } from "@/modular/sections/schedule";
import type { SectionDefinition } from "@/types/modular";

/*
 * A cover may name the ground the section after it starts on (`nextGround`):
 * Date block's next section is on the second surface, and the turns carry
 * on from there. Another cover (Centred, `11`) restarts them at the surface.
 * Date `1` and Schedule `1` take their turns.
 */
function grounds(...sections: [SectionDefinition, string][]) {
  return sectionGrounds(
    sections.map(([definition, variant]) => ({ definition, variant })),
  );
}

test("after Date block, the next section is on the second surface and the turns carry on", () => {
  expect(grounds([cover, "10"], [date, "1"], [schedule, "1"])).toEqual([
    "surface",
    "surface-alt",
    "surface",
  ]);
});

test("after another cover, the next section starts on the surface", () => {
  expect(grounds([cover, "11"], [date, "1"], [schedule, "1"])).toEqual([
    "surface",
    "surface",
    "surface-alt",
  ]);
});
