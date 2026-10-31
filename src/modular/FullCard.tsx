import type { ReactNode } from "react";
import { text } from "./content";
import { SectionHeading } from "./SectionHeading";
import {
  COLUMN,
  CORNER,
  GROUND_FILL,
  LINED_CELL,
  PAD,
  SECTION_GROUND,
  STACK,
  UNLINED_PULL,
} from "./styles";
import type { SectionGround, SectionValues } from "@/types/modular";

/** A full card's padding; Menu's Framed card's inner frame too. */
export const FULL_CARD_PAD = "px-6 py-12 @3xl:px-12 @3xl:py-16";

/* The card: as wide as the section's content, 960px at most (`COLUMN`), the section's own fill, so it hides the page's pattern, with the host's corners. */
const CARD = `${COLUMN} ${CORNER} ${FULL_CARD_PAD}`;

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
 * in the palette's line colour, the top one only under a heading; with
 * `accent`, the card on the accent and no lines. No other line is the card's.
 */
export function FullCard({
  values,
  ground,
  accent = false,
  children,
}: {
  values: SectionValues;
  ground: SectionGround;
  /** The card on the accent, no lines: the Full card accent styles. */
  accent?: boolean;
  children: ReactNode;
}) {
  const heading =
    text(values, "eyebrow") || text(values, "heading") || text(values, "note");

  return (
    <FullCardFrame ground={accent ? "accent" : ground}>
      <div className={STACK}>
        <SectionHeading values={values} />
        <div
          className={
            !accent
              ? `${heading ? "border-t-1" : ""} border-b-1 border-[var(--m-line)]`
              : ""
          }
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
export function fullCardGrid(count: number, accent = false): string {
  return `grid overflow-hidden ${GRID_COLUMNS[count]} ${accent ? UNLINED_PULL : ""}`;
}

/* A full card grid's cell without its hairlines, its content centred; its sides a little narrower than a Grid's, as the card is. */
const CELL_NO_LINES =
  "flex flex-col items-center px-6 py-8 text-center @3xl:px-4 @3xl:py-10";

/** A full card grid's cell: with the Grid's hairlines (`LINED_CELL`), or none on the accent. */
export function fullCardCell(accent = false): string {
  return accent ? CELL_NO_LINES : `${LINED_CELL} ${CELL_NO_LINES}`;
}
