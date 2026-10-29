import type { ReactNode } from "react";
import { text } from "./content";
import { SectionHeading } from "./SectionHeading";
import {
  CORNER,
  GROUND_FILL,
  LINED_CELL,
  PAD,
  SECTION_GROUND,
  STACK,
} from "./styles";
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

/* A full card grid's columns from `@3xl`, by how many items: up to three in a row, four as two rows of two, five or six three to a row. */
const GRID_COLUMNS = [
  "",
  "",
  "@3xl:grid-cols-2",
  "@3xl:grid-cols-3",
  "@3xl:grid-cols-2",
  "@3xl:grid-cols-3",
  "@3xl:grid-cols-3",
];

/**
 * Items side by side in a full card, between its lines (`GRID_COLUMNS`),
 * one column on a phone, hairlines between them as the Grid's cells
 * (`LINED_CELL`): Contact's, Special people's and Accommodation's Full
 * card & grid.
 */
export function fullCardGrid(count: number): string {
  return `grid overflow-hidden ${GRID_COLUMNS[count]}`;
}

/** A full card grid's cell, its content centred; its sides a little narrower than a Grid's, as the card is. */
export const FULL_CARD_CELL = `${LINED_CELL} flex flex-col items-center px-6 py-8 text-center @3xl:px-4 @3xl:py-10`;
