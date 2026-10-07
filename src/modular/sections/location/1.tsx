import { CardIcon } from "@/modular/cards/CardIcon";
import { imageSrc, list, mapsQuery } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import { WashedPhoto } from "@/modular/WashedPhoto";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  ARROW_NUDGE,
  CORNER,
  EYEBROW,
  GROUND,
  VENUE,
  LEAD,
  LINK,
  PAD,
  SPLIT_COLUMNS,
  STACK,
} from "@/modular/styles";
import { otherGround } from "@/modular/ground";
import { INVITE_COLUMN } from "@/modular/vars";
import type { ListItem, SectionGround, VariantProps } from "@/types/modular";

/*
 * The photo is the wide 3fr of `SPLIT_COLUMNS`, inside the column less its
 * 120px side padding (`PAD_X` on a wide page).
 */
const PHOTO_SIZES = `(min-width: ${INVITE_COLUMN}px) ${((INVITE_COLUMN - 240) * 3) / 5}px, (min-width: 768px) 60vw, 100vw`;

/**
 * Each location a card: the venue on the accent beside a photo of it,
 * washed in the same accent, the cards stacked. No map is embedded, so
 * nothing reaches a map provider before the guest taps "Open in Maps". The
 * photo is required here; while it is missing the alternate surface stands
 * in.
 */
export function Variant({ values, ground }: VariantProps) {
  const venues = list(values, "venues");

  return (
    <div className={`${STACK} ${GROUND[ground]} ${PAD}`}>
      {/* No italic heading here, even one kept from another variant. */}
      <SectionHeading values={values} />
      {venues.length > 0 ? (
        <ul className="flex flex-col gap-4 @3xl:gap-6">
          {venues.map((venue, index) => (
            <VenueCard key={index} venue={venue} ground={ground} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function VenueCard({
  venue,
  ground,
}: {
  venue: ListItem;
  ground: SectionGround;
}) {
  const photo = imageSrc(venue.photo ?? "");

  return (
    <li
      className={`${CORNER} grid overflow-hidden border-1 border-[var(--m-line)] ${SPLIT_COLUMNS}`}
    >
      <div className="flex flex-col items-center justify-center bg-[var(--m-accent)] p-8 text-center text-[color:var(--m-accent-ink)] @3xl:items-start @3xl:px-12 @3xl:py-10 @3xl:text-left">
        {venue.label ? (
          <p
            className={`${EYEBROW} inline-flex items-center gap-3 leading-none!`}
          >
            <CardIcon name="pin" tone="accent" />
            {venue.label}
          </p>
        ) : null}
        <h3 className={`${VENUE} mt-6 mb-2`}>{venue.venue}</h3>
        <p
          className={`${LEAD} whitespace-pre-line text-[color:var(--m-accent-ink-muted)]`}
        >
          {venue.address}
        </p>
        <MapsLink
          query={mapsQuery(venue.venue, venue.address)}
          className={`${LINK} mt-4 transition-opacity hover:opacity-80`}
        >
          <Icon name="arrow-up-right" className={ARROW_NUDGE} />
        </MapsLink>
      </div>
      <div className={`relative min-h-84 ${GROUND[otherGround(ground)]}`}>
        {photo ? (
          <WashedPhoto src={photo} sizes={PHOTO_SIZES} ground={ground} />
        ) : null}
      </div>
    </li>
  );
}
