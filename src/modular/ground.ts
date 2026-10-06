import type { Ground, SectionDefinition, SectionGround } from "@/types/modular";

/** The other surface: a card's, on a section of this ground (on the accent, `surface`). */
export function otherGround(ground: SectionGround): Ground {
  return ground === "surface" ? "surface-alt" : "surface";
}

/**
 * Each section's ground, in page order, by its variant's rule or else its
 * own (`GroundRule`). The surfaces take turns, starting with `surface`, so
 * whatever the host leaves out no two neighbours match. An `own` or
 * `accent` section breaks the turns, and the next one starts again at
 * `surface`; a `joined` one takes the ground of the section right before.
 * An `own` section's value is never drawn.
 */
export function sectionGrounds(
  sections: { definition: SectionDefinition; variant: string }[],
): SectionGround[] {
  let turn: Ground | null = null;
  let before: SectionGround = "surface";
  return sections.map(({ definition, variant }) => {
    const rule =
      definition.variants.find(({ id }) => id === variant)?.ground ??
      definition.ground;
    let ground: SectionGround;
    if (rule === "own" || rule === "accent") {
      turn = null;
      ground = rule === "accent" ? "accent" : "surface";
    } else if (rule === "joined") {
      ground = before;
    } else {
      turn = turn ? otherGround(turn) : "surface";
      ground = turn;
    }
    before = ground;
    return ground;
  });
}
