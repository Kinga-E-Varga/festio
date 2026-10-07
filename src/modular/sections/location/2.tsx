import { imageSrc, list, mapsQuery } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import { WashedPhoto } from "@/modular/WashedPhoto";
import {
  ARROW_NUDGE,
  EYEBROW,
  GROUND,
  H2,
  ICON_DISC,
  LEAD,
  MUTED,
  PAD_SNUG,
  TONES,
  VENUE,
  LINK,
} from "@/modular/styles";
import { otherGround } from "@/modular/ground";
import { INVITE_COLUMN } from "@/modular/vars";
import type { ListItem, VariantProps } from "@/types/modular";

/* The photo is half the column, edge to edge. */
const PHOTO_SIZES = `(min-width: ${INVITE_COLUMN}px) ${INVITE_COLUMN / 2}px, (min-width: 768px) 50vw, 100vw`;

/**
 * The column split in two halves, edge to edge: the locations on the
 * section's ground, one photo filling the other half — the first location's
 * that has one — under them on a phone. One location stands under a large
 * pin disc; two or more are stops, each a smaller one, joined by a line,
 * like a route. No
 * heading. The photo is required here; while it is missing the other
 * surface stands in.
 */
export function Variant({ values, ground }: VariantProps) {
  const venues = list(values, "venues");
  const photo = imageSrc(venues.find((venue) => venue.photo)?.photo ?? "");
  if (venues.length === 0) return null;

  return (
    <div className={`grid ${GROUND[ground]} @3xl:grid-cols-2`}>
      <div className={`flex flex-col justify-center ${PAD_SNUG}`}>
        {venues.length === 1 ? (
          <div className="flex flex-col items-center text-center @3xl:items-start @3xl:text-left">
            <span className={`${ICON_DISC} mb-6 size-14 ${TONES.secondary}`}>
              <Icon name="pin" className="size-8" />
            </span>
            <Venue venue={venues[0]} size={VENUE_LARGE} />
          </div>
        ) : (
          <ol className="flex flex-col">
            {venues.map((venue, index) => (
              <li
                key={index}
                className={`relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 @3xl:gap-x-6 ${index < venues.length - 1 ? STOP_LINE : ""}`}
              >
                <span className={`${ICON_DISC} size-9 ${TONES.secondary}`}>
                  <Icon name="pin" className="size-5.5" />
                </span>
                <div className="flex flex-col items-start pt-1.5">
                  <Venue venue={venue} size={VENUE_SMALL} />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div
        className={`relative min-h-88 ${GROUND[otherGround(ground)]} @3xl:min-h-120`}
      >
        {photo ? (
          <WashedPhoto src={photo} sizes={PHOTO_SIZES} ground={ground} />
        ) : null}
      </div>
    </div>
  );
}

/* The venue's name: a section heading when it stands alone, a card's name as one of several stops. */
const VENUE_LARGE = H2;
const VENUE_SMALL = VENUE;

/*
 * A stop's share of the route: room below it, and a line from under its
 * disc down to the next one. The line sits on the disc's centre (half
 * of its 36px).
 */
const STOP_LINE =
  "pb-12 before:absolute before:top-11 before:bottom-2 before:left-[17.5px] before:w-px before:bg-[var(--m-line)]";

/** One location's label, venue, address, detail and the way there. */
function Venue({ venue, size }: { venue: ListItem; size: string }) {
  return (
    <>
      {venue.label ? (
        <p className={`${EYEBROW} ${MUTED}`}>{venue.label}</p>
      ) : null}
      <h3 className={`${size} mt-3 text-[color:var(--m-ink)]`}>
        {venue.venue}
      </h3>
      <p className={`${LEAD} ${MUTED} mt-4 max-w-sm whitespace-pre-line`}>
        {venue.address}
      </p>
      {venue.detail ? (
        <p
          className={`${LEAD} mt-3 font-semibold whitespace-pre-line text-[color:var(--m-ink)]`}
        >
          {venue.detail}
        </p>
      ) : null}
      <MapsLink
        query={mapsQuery(venue.venue, venue.address)}
        className={`${LINK} mt-4 transition-opacity hover:opacity-80 text-[color:var(--m-ink)]`}
      >
        <Icon name="arrow-up-right" className={ARROW_NUDGE} />
      </MapsLink>
    </>
  );
}
