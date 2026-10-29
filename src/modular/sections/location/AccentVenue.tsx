import { Icon, isIconName } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import {
  ARROW_NUDGE,
  BODY,
  BODY_SM,
  INNER_EYEBROW,
  GROUND,
  CARD_DISC,
  LINK,
  MUTED,
  TONES,
  H3,
} from "@/modular/styles";
import type { ListItem, SectionGround } from "@/types/modular";

/**
 * Several cards, one to a row at full width until they stand side by
 * side: two from `@3xl`, 480px each at most; three only from `@5xl`,
 * 380px each at most, where each still has room for a venue's name — never
 * two and one. Either way the room left is shared evenly around them.
 */
export const ROW = [
  "",
  "",
  "@3xl:justify-evenly @3xl:grid-cols-[repeat(2,minmax(0,480px))]",
  "@5xl:justify-evenly @5xl:grid-cols-[repeat(3,minmax(0,380px))]",
];

/**
 * A location card's text on `fill` — the accent for Accent cards, a
 * surface for Cards: label, venue, address, detail and the way there, in
 * the roles that read on it (`GROUND`; on the accent all are its ink). The
 * venue's icon, when it has one, on its soft disc in the palette's `tone`,
 * over the label.
 * Centred; padding past the phone's and where it turns left-aligned and
 * top-aligned (cards side by side, so their icons line up) are the
 * variant's.
 */
export function AccentVenue({
  venue,
  fill,
  tone,
  className = "",
}: {
  venue: ListItem;
  fill: SectionGround;
  tone: "accent" | "secondary";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${GROUND[fill]} ${className}`}
    >
      {isIconName(venue.icon) ? (
        // The palette's colours even on the accent fill, which turns them into its ink.
        <span
          className={`${CARD_DISC} mb-5 [--m-accent:var(--m-page-accent)] [--m-secondary:var(--m-page-secondary)] ${TONES[tone]}`}
        >
          <Icon name={venue.icon} className="size-5.5" />
        </span>
      ) : null}
      {venue.label ? (
        <p className={`${INNER_EYEBROW} text-[color:var(--m-secondary)]`}>
          {venue.label}
        </p>
      ) : null}
      <h3 className={`${H3} mt-4 mb-1`}>{venue.venue}</h3>
      <p className={`${BODY_SM} ${MUTED} whitespace-pre-line`}>
        {venue.address}
      </p>
      {venue.detail ? (
        <p className={`${BODY} mt-5 font-semibold whitespace-pre-line`}>
          {venue.detail}
        </p>
      ) : null}
      <MapsLink
        href={venue.mapsLink}
        // Its 44px tap height overhangs the words by 12px on each side: mt-2 leaves 20px above them, like the gaps above; -mb-3 takes it back from the card's padding, so the bottom matches the top.
        className={`${LINK} mt-2 -mb-3 transition-opacity hover:opacity-80`}
      >
        <Icon name="arrow-up-right" className={ARROW_NUDGE} />
      </MapsLink>
    </div>
  );
}
