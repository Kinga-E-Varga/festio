import { expect, test } from "vitest";
import { contentParts } from "@/modular/fields";
import { section as notes } from "@/modular/sections/notes";
import { section as dressCode } from "@/modular/sections/dress-code";
import { section as gifts } from "@/modular/sections/gifts";
import type { ModularLibrary, ModularState } from "@/types/modular";

/*
 * Helpful notes with Dress code and Gifts switched on (switches are on
 * unless set to false), custom notes off. Only the sections matter here.
 */
const LIBRARY = {
  sections: [notes, dressCode, gifts],
} as unknown as ModularLibrary;
const STATE = {
  values: { notes: { showCustom: false } },
} as unknown as ModularState;

function twinIcons(variant: string, state = STATE): boolean[] {
  return contentParts(state, LIBRARY, notes, variant)
    .filter(({ section }) => section !== notes.id)
    .map(
      ({ shows, fields }) =>
        shows.has("icon") || fields.some(({ id }) => id === "icon"),
    );
}

/** Helpful notes with its switches set as `switches` (Use icons, Use numbers). */
function withSwitches(switches: Record<string, boolean>): ModularState {
  return {
    values: { notes: { showCustom: false, ...switches } },
  } as unknown as ModularState;
}

test("every style offers Dress code's and Gifts' icon", () => {
  for (const variant of ["1", "3", "4", "5", "6", "7", "8", "9"]) {
    expect(twinIcons(variant)).toEqual([true, true]);
  }
});

test("Use icons off or Use numbers on: no Dress code or Gifts icon", () => {
  for (const variant of ["1", "3", "7"]) {
    expect(twinIcons(variant, withSwitches({ icons: false }))).toEqual([
      false,
      false,
    ]);
    expect(twinIcons(variant, withSwitches({ numbers: true }))).toEqual([
      false,
      false,
    ]);
  }
});
