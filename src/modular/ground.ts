import type { Ground, SectionDefinition } from "@/types/modular";

/** The other surface: a card's, on a section of this ground. */
export function otherGround(ground: Ground): Ground {
  return ground === "surface" ? "surface-alt" : "surface";
}

/**
 * Each section's ground, in page order. The surfaces take turns, starting
 * with `surface`, so whatever the host leaves out no two neighbours match.
 * An `own` section is skipped (its value is never drawn) and the turns
 * carry on past it; a `joined` one takes the ground of the one before.
 */
export function sectionGrounds(sections: SectionDefinition[]): Ground[] {
  let last: Ground | null = null;
  return sections.map(({ ground }) => {
    if (ground === "own") return "surface";
    if (ground === "joined" && last) return last;
    last = last ? otherGround(last) : "surface";
    return last;
  });
}
