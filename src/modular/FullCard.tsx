import type { ReactNode } from "react";
import { text } from "./content";
import { SectionHeading } from "./SectionHeading";
import { CORNER, GROUND_FILL, PAD, SECTION_GROUND, STACK } from "./styles";
import type { SectionGround, SectionValues } from "@/types/modular";

/** A full card's padding; Menu's Framed card's inner frame too. */
export const FULL_CARD_PAD = "px-6 py-12 @3xl:px-12 @3xl:py-16";

/**
 * A full card's width, centred: 75% of the section's, never under 640px
 * (the whole width where there is less) nor over 960px. Menu's Framed card
 * too.
 */
export const FULL_CARD_WIDTH = "mx-auto w-[clamp(640px,75%,960px)] max-w-full";

/* The card: the section's own fill, so it hides the page's pattern, with the host's corners. */
const CARD = `${FULL_CARD_WIDTH} ${CORNER} ${FULL_CARD_PAD}`;

/** The full card alone, on the section's padding: Dress code's and Gifts' Full card. */
export function FullCardFrame({
  ground,
  children,
}: {
  ground: SectionGround;
  children: ReactNode;
}) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={`${GROUND_FILL[ground]} ${CARD}`}>{children}</div>
    </div>
  );
}

/**
 * A full card style: the whole section in one card on its own ground. The
 * heading centred (`SectionHeading`), then the content between two lines
 * in the palette's line colour, the top one only under a heading. No
 * other line is the card's.
 */
export function FullCard({
  values,
  ground,
  children,
}: {
  values: SectionValues;
  ground: SectionGround;
  children: ReactNode;
}) {
  const heading =
    text(values, "eyebrow") || text(values, "heading") || text(values, "note");

  return (
    <FullCardFrame ground={ground}>
      <div className={STACK}>
        <SectionHeading values={values} />
        <div
          className={`${heading ? "border-t-1" : ""} border-b-1 border-[var(--m-line)]`}
        >
          {children}
        </div>
      </div>
    </FullCardFrame>
  );
}
