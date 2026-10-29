import { imageSrc } from "@/modular/content";
import { WashedPhoto } from "@/modular/WashedPhoto";
import {
  COLUMN,
  CORNER,
  GROUND,
  SPLIT_COLUMNS,
  turnTone,
} from "@/modular/styles";
import { otherGround } from "@/modular/ground";
import { INVITE_COLUMN } from "@/modular/vars";
import type { ListItem, SectionGround } from "@/types/modular";
import { AccentVenue, ROW } from "./AccentVenue";

type Tone = "accent" | "secondary";

/*
 * The photo, inside the full column less its 100px side padding (`PAD_X` on a
 * wide page): the wide 3fr of `SPLIT_COLUMNS` beside a venue, the card's
 * width (`ROW`'s 480px at most) under one.
 */
const PHOTO_SIZES = `(min-width: ${INVITE_COLUMN}px) ${((INVITE_COLUMN - 200) * 3) / 5}px, (min-width: 768px) 60vw, 100vw`;
const PHOTO_SIZES_UNDER = "(min-width: 768px) 480px, 100vw";

/*
 * Where a card's photo goes. `beside`: right of the venue from `@3xl`, under
 * it on a phone. `under`: always under, one height, so a name that wraps
 * grows its own box, not the photo, and every card's photo matches.
 * `turns`: beside while the cards stack one to a row, under again once they
 * stand three in a row.
 */
const CARD_LAYOUT = {
  beside: {
    card: `grid ${SPLIT_COLUMNS}`,
    text: "@3xl:px-12 @3xl:py-10",
    photo: "min-h-84",
    sizes: PHOTO_SIZES,
  },
  under: {
    card: "flex flex-col",
    text: "flex-1 @3xl:justify-start",
    photo: "h-84",
    sizes: PHOTO_SIZES_UNDER,
  },
  turns: {
    card: `flex flex-col @3xl:grid ${SPLIT_COLUMNS} @5xl:flex`,
    text: "flex-1 @3xl:px-12 @3xl:py-10 @5xl:p-8 @5xl:justify-start",
    photo: "h-84 @3xl:h-auto @3xl:min-h-84 @5xl:h-84",
    sizes: PHOTO_SIZES,
  },
};

type CardLayout = keyof typeof CARD_LAYOUT;

/** A lone venue's photo beside it, a pair's under them, three's in turn. */
const LAYOUT_FOR: CardLayout[] = ["beside", "beside", "under", "turns"];

/**
 * The locations as cards, for Accent cards and Cards: the venue on `fill`
 * beside a photo of it. Several stand in
 * one row on a wide page, each photo under its venue, as on a phone; three
 * stacked one to a row keep the photo beside. No map is embedded, so
 * nothing reaches a map provider before the guest taps "Open in Maps". The
 * photo is required; while it is missing the alternate surface stands in.
 * A venue's icon, when it has one, stands on a soft disc over its label,
 * the discs taking turns: the 1st and 3rd in the accent, the 2nd in the
 * secondary — on the accent fill all in the accent. With photos switched off, each card is the venue alone, its
 * icon still over its label.
 */
export function VenueCards({
  venues,
  ground,
  photos,
  fill,
}: {
  venues: ListItem[];
  ground: SectionGround;
  photos: boolean;
  /** What the venues stand on: the accent, or a surface. */
  fill: SectionGround;
}) {
  if (venues.length === 0) return null;
  return (
    <ul className={`grid gap-4 @3xl:gap-6 ${ROW[venues.length]}`}>
      {venues.map((venue, index) => {
        const tone = fill === "accent" ? "accent" : turnTone(index);
        return photos ? (
          <VenueCard
            key={index}
            venue={venue}
            ground={ground}
            layout={LAYOUT_FOR[venues.length]}
            fill={fill}
            tone={tone}
          />
        ) : (
          <TextCard
            key={index}
            venue={venue}
            count={venues.length}
            fill={fill}
            tone={tone}
          />
        );
      })}
    </ul>
  );
}

function VenueCard({
  venue,
  ground,
  layout,
  fill,
  tone,
}: {
  venue: ListItem;
  ground: SectionGround;
  layout: CardLayout;
  fill: SectionGround;
  tone: Tone;
}) {
  const photo = imageSrc(venue.photo ?? "");
  const look = CARD_LAYOUT[layout];

  return (
    <li
      className={`${CORNER} ${COLUMN} overflow-hidden border-1 border-[var(--m-line)] ${look.card}`}
    >
      <AccentVenue
        venue={venue}
        fill={fill}
        tone={tone}
        className={`@3xl:items-start @3xl:text-left ${look.text}`}
      />
      <div className={`relative ${look.photo} ${GROUND[otherGround(ground)]}`}>
        {photo ? (
          <WashedPhoto src={photo} sizes={look.sizes} ground={ground} />
        ) : null}
      </div>
    </li>
  );
}

/*
 * A card without a photo's text from `@3xl`, by how many cards: while a card
 * has the row to itself, centred with a photo card's roomier padding; once
 * they stand side by side, left-aligned and at the top with the phone's, so
 * the icons and labels line up across the row.
 */
const TEXT_ONLY = [
  "",
  "@3xl:px-12 @3xl:py-10",
  "@3xl:items-start @3xl:justify-start @3xl:text-left",
  "@3xl:px-12 @3xl:py-10 @5xl:p-8 @5xl:items-start @5xl:justify-start @5xl:text-left",
];

/**
 * A location card without a photo, one of `count` in a `ROW`: photos
 * switched off.
 */
function TextCard({
  venue,
  count,
  fill,
  tone,
}: {
  venue: ListItem;
  count: number;
  fill: SectionGround;
  tone: Tone;
}) {
  return (
    <li
      className={`${CORNER} flex flex-col overflow-hidden border-1 border-[var(--m-line)] ${COLUMN}`}
    >
      <AccentVenue
        venue={venue}
        fill={fill}
        tone={tone}
        className={`flex-1 ${TEXT_ONLY[count]}`}
      />
    </li>
  );
}
