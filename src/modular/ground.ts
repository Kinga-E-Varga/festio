import type {
  Ground,
  GroundRule,
  SectionDefinition,
  SectionGround,
} from "@/types/modular";

/** The other surface: a card's, on a section of this ground (on the accent, `surface`). */
export function otherGround(ground: SectionGround): Ground {
  return ground === "surface" ? "surface-alt" : "surface";
}

/** A section's ground rule: its variant's, or else its own. */
export function groundRule(
  definition: SectionDefinition,
  variant: string,
): GroundRule | undefined {
  return (
    definition.variants.find(({ id }) => id === variant)?.ground ??
    definition.ground
  );
}

/** A variant's `band`: the colour the page paints behind an `own` section. */
export function bandOf(definition: SectionDefinition, variant: string) {
  return definition.variants.find(({ id }) => id === variant)?.band;
}

/** An `own` section's ground: its band, when that is one of the grounds; else the page's surface. */
function ownGround(
  definition: SectionDefinition,
  variant: string,
): SectionGround {
  const band = bandOf(definition, variant);
  return band === "accent" || band === "surface-alt" ? band : "surface";
}

/**
 * Each section's ground, in page order, by its variant's rule or else its
 * own (`GroundRule`). The surfaces take turns, starting with `surface`, so
 * whatever the host leaves out no two neighbours match. An `own` or
 * `accent` section breaks the turns, and the next one starts again at
 * `surface`; a `joined` one takes the ground of the section right before
 * (an `own` one's band) and the turns carry on from it; a `surface` one is
 * always on the `surface`, and the next one takes the other. An `own` section's
 * value only reaches a `joined` one after it; the page paints its band.
 */
export function sectionGrounds(
  sections: { definition: SectionDefinition; variant: string }[],
): SectionGround[] {
  let turn: Ground | null = null;
  let before: SectionGround = "surface";
  return sections.map(({ definition, variant }) => {
    const rule = groundRule(definition, variant);
    let ground: SectionGround;
    if (rule === "own" || rule === "accent") {
      turn = null;
      ground = rule === "accent" ? "accent" : ownGround(definition, variant);
    } else if (rule === "joined") {
      ground = before;
      turn = before === "accent" ? null : before;
    } else if (rule === "surface") {
      turn = "surface";
      ground = turn;
    } else {
      turn = turn ? otherGround(turn) : "surface";
      ground = turn;
    }
    before = ground;
    return ground;
  });
}
