import { TurnIcon } from "@/modular/cards/CardIcon";
import { imageSrc, isOn, list } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import { FullCard } from "@/modular/FullCard";
import { WashedPhoto } from "@/modular/WashedPhoto";
import { otherGround } from "@/modular/ground";
import {
  ARROW_NUDGE,
  BODY,
  BODY_SM,
  INNER_EYEBROW,
  GROUND,
  INK_LINK,
  MUTED,
  SECTION_GROUND,
  TONE_TEXT,
  H3,
} from "@/modular/styles";
import type { ListItem, SectionGround, VariantProps } from "@/types/modular";

/*
 * A row: the photo, then the venue with the way there under it. On a
 * phone it stacks, the photo under the venue, 320px wide at most. From
 * `@3xl` the photo behaves as on a lone card: the wide 3fr of the row, as
 * tall as the venue needs and never under 336px, the venue 48px from it.
 */
const ROW =
  "grid grid-cols-[minmax(0,1fr)] items-start gap-6 py-8 @3xl:grid-cols-[minmax(0,32rem)_minmax(0,22rem)] @3xl:items-center @3xl:justify-center @3xl:gap-x-12 @3xl:py-10";

/*
 * The photo: 320px wide at most on a phone. From `@3xl` it shares the row
 * with the text until the text reaches 22rem, then takes the rest, up to
 * 512px (32rem), always 16.5rem tall, so it widens without growing; the
 * pair centred either way.
 */
const PHOTO_SIZES = "(min-width: 1100px) 512px, (min-width: 768px) 50vw, 320px";

/**
 * List & grid (`3`) as a full card (`FullCard`): the heading centred, the
 * locations under it between the card's lines. With photos, a list: one
 * row each — the photo (left, then right, in turn), the label, venue,
 * address and detail, and the way there. The photo is required while photos are on;
 * while it is missing the other surface stands in. With photos off, the
 * venues one under another, a line between each. Either way each venue's
 * icon, when it has one, on a soft disc over its label, the discs taking
 * turns accent / secondary, as Accommodation's Full card & list.
 */
export function Variant({ values, ground }: VariantProps) {
  const venues = list(values, "venues");
  if (venues.length === 0) return null;
  const photos = isOn(values, "photos");

  return (
    <FullCard values={values} ground={ground}>
      {photos ? (
        <ol className="text-center">
          {venues.map((venue, index) => (
            <VenueRow key={index} venue={venue} ground={ground} index={index} />
          ))}
        </ol>
      ) : (
        /* One under another, a line across the card between each. */
        <ol className="divide-y-1 divide-[var(--m-line)]">
          {venues.map((venue, index) => (
            <li
              key={index}
              className={`${SECTION_GROUND[ground]} px-5 py-8 text-center @3xl:py-10`}
            >
              <VenueText venue={venue} index={index} />
            </li>
          ))}
        </ol>
      )}
    </FullCard>
  );
}

function VenueRow({
  venue,
  ground,
  index,
}: {
  venue: ListItem;
  ground: SectionGround;
  index: number;
}) {
  const photo = imageSrc(venue.photo ?? "");
  const flipped = index % 2 === 1;

  return (
    /*
     * With photos, every second row reads its columns right to left, so the
     * photo keeps its width on the right; each cell reads left to right again.
     */
    <li className={`${ROW} ${flipped ? "@3xl:[direction:rtl]" : ""}`}>
      <div
        className={`relative order-last aspect-[4/3] w-full max-w-80 justify-self-center [direction:ltr] ${GROUND[otherGround(ground)]} @3xl:order-none @3xl:aspect-auto @3xl:h-66 @3xl:max-w-none`}
      >
        {photo ? (
          <WashedPhoto src={photo} sizes={PHOTO_SIZES} ground={ground} />
        ) : null}
      </div>
      <VenueText
        venue={venue}
        index={index}
        className="[direction:ltr] @3xl:self-center"
      />
    </li>
  );
}

/**
 * The venue and the way there: the card's sizes and spacing (`AccentVenue`),
 * in the section's inks, its icon, when it has one, on a soft disc over its
 * label, the discs taking turns accent / secondary by `index`.
 */
function VenueText({
  venue,
  index,
  className = "",
}: {
  venue: ListItem;
  index: number;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <TurnIcon name={venue.icon} index={index} className="mb-5 self-center" />
      {venue.label ? (
        <p className={`${INNER_EYEBROW} ${TONE_TEXT.secondary} mb-4`}>
          {venue.label}
        </p>
      ) : null}
      <h3 className={`${H3} mb-1`}>{venue.venue}</h3>
      <p className={`${BODY_SM} ${MUTED} whitespace-pre-line`}>
        {venue.address}
      </p>
      {venue.detail ? (
        <p
          className={`${BODY} mt-5 font-semibold whitespace-pre-line text-[color:var(--m-ink)]`}
        >
          {venue.detail}
        </p>
      ) : null}
      {/* The way there under the venue, as on the cards. */}
      <MapsLink
        href={venue.mapsLink}
        className={`${INK_LINK} mt-2 -mb-3 self-center`}
      >
        <Icon name="arrow-up-right" className={ARROW_NUDGE} />
      </MapsLink>
    </div>
  );
}
