import type { ReactNode } from "react";
import { imageSrc, isOn, list } from "@/modular/content";
import { WashedPhoto } from "@/modular/WashedPhoto";
import {
  CORNER,
  EYEBROW,
  GROUND,
  PAD,
  SECTION_GROUND,
  SPLIT,
} from "@/modular/styles";
import { otherGround } from "@/modular/ground";
import type { ListItem, SectionGround, SectionValues } from "@/types/modular";
import { Venue } from "./Venue";

/* The photo, the split's content column: 620px at most. */
const PHOTO_SIZES = "(min-width: 768px) 620px, 100vw";

/*
 * The venues without photos side by side, by how many: two from `@3xl`,
 * three only from `@5xl`, where names at a heading's size still fit; the
 * hairlines between them then stand upright, each venue 36px from them.
 */
const IN_A_ROW = [
  { row: "", cell: "" },
  { row: "", cell: "" },
  {
    row: "@3xl:grid-cols-2 @3xl:divide-y-0 @3xl:divide-x-1",
    cell: "@3xl:px-9 @3xl:py-0 @3xl:first:pl-0 @3xl:last:pr-0",
  },
  {
    row: "@5xl:grid-cols-3 @5xl:divide-y-0 @5xl:divide-x-1",
    cell: "@5xl:px-9 @5xl:py-0 @5xl:first:pl-0 @5xl:last:pr-0",
  },
];

/** What stands over a venue's name: its label, or its icon. */
export type Lead = (venue: ListItem) => ReactNode;

/** The label as the lead, in the secondary: Simple's and Two-line's. */
export function labelLead(venue: ListItem) {
  return venue.label ? (
    <p className={`${EYEBROW} mb-4 text-[color:var(--m-secondary)]`}>
      {venue.label}
    </p>
  ) : null;
}

/**
 * The locations of Simple, Icon and Two-line, which differ only in what
 * stands over each venue's name (`lead`), whether the detail leads the name
 * (`twoLine`, `Venue`) and, without photos, the venues' alignment. Each location a row split as the
 * other sections are: the venue where their heading goes, its lead over
 * its name, which is the heading, and
 * its photo where their content goes — right of the first, left of the
 * second, and so on; under the venue on a phone. The text is left-aligned
 * beside the photo. No section heading. The photo is required here; while it is
 * missing the other surface stands in. With photos switched off, the
 * venues alone, one under another, centred across the column or, with
 * `rowWithoutPhotos`, left-aligned and side by side once there is room
 * (`IN_A_ROW`), a hairline between each either way.
 */
export function VenueRows({
  values,
  ground,
  lead,
  twoLine = false,
  rowWithoutPhotos = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  lead: Lead;
  twoLine?: boolean;
  rowWithoutPhotos?: boolean;
}) {
  const venues = list(values, "venues");
  if (venues.length === 0) return null;

  if (!isOn(values, "photos")) {
    return (
      /*
       * A hairline between the venues, halfway through the gap the photo
       * rows keep, so the spacing stays the same.
       */
      <div
        className={`grid divide-y-1 divide-[var(--m-line)] ${SECTION_GROUND[ground]} ${PAD} ${rowWithoutPhotos ? IN_A_ROW[venues.length].row : ""}`}
      >
        {venues.map((venue, index) => (
          <VenueText
            key={index}
            venue={venue}
            lead={lead}
            twoLine={twoLine}
            className={`py-7 first:pt-0 last:pb-0 @3xl:py-10 ${rowWithoutPhotos ? `items-start text-left ${IN_A_ROW[venues.length].cell}` : ""}`}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={`flex flex-col gap-14 ${SECTION_GROUND[ground]} ${PAD} @3xl:gap-20`}
    >
      {venues.map((venue, index) => (
        <PhotoRow
          key={index}
          venue={venue}
          ground={ground}
          lead={lead}
          twoLine={twoLine}
          flipped={index % 2 === 1}
        />
      ))}
    </div>
  );
}

function PhotoRow({
  venue,
  ground,
  lead,
  twoLine,
  flipped,
}: {
  venue: ListItem;
  ground: SectionGround;
  lead: Lead;
  twoLine: boolean;
  flipped: boolean;
}) {
  const photo = imageSrc(venue.photo ?? "");

  return (
    /*
     * The other sections' split: the venue where their heading goes, the
     * photo where their content goes. A flipped row reads its columns right
     * to left, so the photo keeps the content's width on the left; each
     * cell reads left to right again.
     */
    <div
      className={`${SPLIT} items-center ${flipped ? "@3xl:[direction:rtl]" : ""}`}
    >
      <VenueText
        venue={venue}
        lead={lead}
        twoLine={twoLine}
        className="[direction:ltr] @3xl:items-start @3xl:text-left"
      />
      <div
        className={`relative min-h-80 overflow-hidden border-1 border-[var(--m-line)] ${CORNER} [direction:ltr] ${GROUND[otherGround(ground)]} @3xl:min-h-108`}
      >
        {photo ? (
          <WashedPhoto src={photo} sizes={PHOTO_SIZES} ground={ground} />
        ) : null}
      </div>
    </div>
  );
}

/** The lead over the venue, centred; `className` turns it left from `@3xl`. */
function VenueText({
  venue,
  lead,
  twoLine,
  className = "",
}: {
  venue: ListItem;
  lead: Lead;
  twoLine: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {lead(venue)}
      <Venue venue={venue} twoLine={twoLine} />
    </div>
  );
}
