import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";
import {
  COLUMN,
  CORNER,
  GROUND_FILL,
  PAD,
  SECTION_GROUND,
  STACK,
  UNLINED_PULL,
} from "./styles";
import type { SectionGround, SectionValues } from "@/types/modular";

/** A full card's padding. */
export const FULL_CARD_PAD = "px-6 py-12 @3xl:px-12 @3xl:py-16";

/** The card: as wide as the section's content, 960px at most (`COLUMN`), with the host's corners; its fill the caller's (here the section's own, so it hides the page's pattern). Text box's card styles too. */
export const FULL_CARD = `${COLUMN} ${CORNER} ${FULL_CARD_PAD}`;

/** The full card alone, on the section's padding: `FullCard`'s frame, and Schedule's Full card accent (`11`). */
export function FullCardFrame({
  ground,
  children,
}: {
  ground: SectionGround;
  children: ReactNode;
}) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={`${GROUND_FILL[ground]} ${FULL_CARD}`}>{children}</div>
    </div>
  );
}

/**
 * A full card style: the whole section in one card on its own ground, or
 * with `accent` on the accent. The heading centred (`SectionHeading`), then
 * the content; no lines.
 */
export function FullCard({
  values,
  ground,
  accent = false,
  children,
}: {
  values: SectionValues;
  ground: SectionGround;
  /** The card on the accent: the Full card accent styles. */
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <FullCardFrame ground={accent ? "accent" : ground}>
      <div className={STACK}>
        <SectionHeading values={values} />
        <div>{children}</div>
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
 * Items side by side in a full card (`GRID_COLUMNS`), one column on a
 * phone, no lines, pulled up to the heading (`UNLINED_PULL`): Contact's,
 * Special people's and Accommodation's Full card & grid.
 */
export function fullCardGrid(count: number): string {
  return `grid overflow-hidden ${GRID_COLUMNS[count]} ${UNLINED_PULL}`;
}

/** A full card grid's cell, no lines, its content centred; its sides a little narrower than a Grid's, as the card is. */
export const FULL_CARD_CELL =
  "flex flex-col items-center px-6 py-8 text-center @3xl:px-4 @3xl:py-10";
