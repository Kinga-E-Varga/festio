import { imageSrc, isOn, list } from "@/modular/content";
import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import { SectionHeading } from "@/modular/SectionHeading";
import { WashedPhoto } from "@/modular/WashedPhoto";
import { otherGround } from "@/modular/ground";
import {
  ARROW_NUDGE,
  BODY,
  BODY_SM,
  INNER_EYEBROW,
  GROUND,
  LINED_CELL,
  LINED_GRID,
  INK_LINK,
  MUTED,
  PAD,
  SECTION_GROUND,
  STACK,
  TONE_TEXT,
  H3,
  columnsFor,
} from "@/modular/styles";
import type { ListItem, SectionGround, VariantProps } from "@/types/modular";

/* The rows' lines, in the palette's line colour. */
const RULE = "border-[var(--m-line)]";

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
 * The section's heading centred, the eyebrow over it and the note under
 * it, and the locations under them as a list: one row each between lines —
 * the photo (left, then right, in turn), the label, venue, address and
 * detail, and the way there. The photo is required while photos are on;
 * while it is missing the other surface stands in. With photos off, the
 * venues side by side with hairlines between (`LINED_GRID`), as
 * Menu's courses.
 */
export function Variant({ values, ground }: VariantProps) {
  const venues = list(values, "venues");
  if (venues.length === 0) return null;
  const photos = isOn(values, "photos");

  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      {photos ? (
        <ol className={`border-t-1 ${RULE} text-center`}>
          {venues.map((venue, index) => (
            <VenueRow
              key={index}
              venue={venue}
              ground={ground}
              flipped={index % 2 === 1}
            />
          ))}
        </ol>
      ) : (
        /* Side by side with hairlines between, as Menu's courses. */
        <ol className={`${LINED_GRID} ${columnsFor(venues.length)}`}>
          {venues.map((venue, index) => (
            <li
              key={index}
              className={`${LINED_CELL} ${SECTION_GROUND[ground]} px-5 py-8 text-center @3xl:py-10`}
            >
              <VenueText venue={venue} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function VenueRow({
  venue,
  ground,
  flipped,
}: {
  venue: ListItem;
  ground: SectionGround;
  flipped: boolean;
}) {
  const photo = imageSrc(venue.photo ?? "");

  return (
    /*
     * With photos, every second row reads its columns right to left, so the
     * photo keeps its width on the right; each cell reads left to right again.
     */
    <li
      className={`border-b-1 ${RULE} ${ROW} ${flipped ? "@3xl:[direction:rtl]" : ""}`}
    >
      <div
        className={`relative order-last aspect-[4/3] w-full max-w-80 justify-self-center [direction:ltr] ${GROUND[otherGround(ground)]} @3xl:order-none @3xl:aspect-auto @3xl:h-66 @3xl:max-w-none`}
      >
        {photo ? (
          <WashedPhoto src={photo} sizes={PHOTO_SIZES} ground={ground} />
        ) : null}
      </div>
      <VenueText venue={venue} className="[direction:ltr] @3xl:self-center" />
    </li>
  );
}

/** The venue and the way there: the card's sizes and spacing (`AccentVenue`), in the section's inks. */
function VenueText({
  venue,
  className = "",
}: {
  venue: ListItem;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
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
