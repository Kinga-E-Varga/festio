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

/** A variant's `nextGround`: where the turns restart after an `own` section. */
function nextGroundOf(definition: SectionDefinition, variant: string) {
  return definition.variants.find(({ id }) => id === variant)?.nextGround;
}

/** A variant's `bare`: the page paints no ground behind it, the variant draws its own. */
export function bareOf(definition: SectionDefinition, variant: string) {
  return definition.variants.find(({ id }) => id === variant)?.bare === true;
}

/**
 * Whether the page paints nothing behind each section, in page order: a
 * `bare` variant (a full card or a sticker, which draws whatever ground it
 * needs itself), an `own` one with no band (a cover, which draws its own),
 * and a `joined` one after either — it takes the ground of the section
 * right before, and that is nothing. From `walkGrounds`.
 */
export function bareGrounds(
  sections: { definition: SectionDefinition; variant: string }[],
): boolean[] {
  return walkGrounds(sections).map(({ bare }) => bare);
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
 * `surface`, or at an `own` one's `nextGround`; a `joined` one takes the ground of the section right before
 * (an `own` one's band) and the turns carry on from it; a `surface` one is
 * always on the `surface`, and the next one takes the other. An `own` section's
 * value only reaches a `joined` one after it; the page paints its band.
 * From `walkGrounds`.
 */
export function sectionGrounds(
  sections: { definition: SectionDefinition; variant: string }[],
): SectionGround[] {
  return walkGrounds(sections).map(({ ground }) => ground);
}

/**
 * The walk both read: each section's ground and whether the page paints it,
 * in page order. One pass, so what a `joined` section takes from the
 * section right before it — its ground, and whether that one was painted —
 * is written here once and can't drift apart.
 */
function walkGrounds(
  sections: { definition: SectionDefinition; variant: string }[],
): { ground: SectionGround; bare: boolean }[] {
  let turn: Ground | null = null;
  let before: { ground: SectionGround; bare: boolean } = {
    ground: "surface",
    bare: false,
  };
  return sections.map(({ definition, variant }) => {
    const rule = groundRule(definition, variant);
    let ground: SectionGround;
    if (rule === "own" || rule === "accent") {
      /* The turn before the one the next section takes: the next takes the other. */
      const next = rule === "own" ? nextGroundOf(definition, variant) : null;
      turn = next ? otherGround(next) : null;
      ground = rule === "accent" ? "accent" : ownGround(definition, variant);
    } else if (rule === "joined") {
      ground = before.ground;
      turn = ground === "accent" ? null : ground;
    } else if (rule === "surface") {
      turn = "surface";
      ground = turn;
    } else {
      turn = turn ? otherGround(turn) : "surface";
      ground = turn;
    }
    const bare =
      bareOf(definition, variant) ||
      (rule === "own" && !bandOf(definition, variant)) ||
      (rule === "joined" && before.bare);
    before = { ground, bare };
    return before;
  });
}
