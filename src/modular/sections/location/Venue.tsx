import { Icon } from "@/modular/icons";
import { MapsLink } from "@/modular/MapsLink";
import {
  ARROW_NUDGE,
  BODY,
  BODY_SM,
  H2,
  INK_LINK,
  MUTED,
} from "@/modular/styles";
import type { ListItem } from "@/types/modular";

/**
 * A location of Simple: its name as large as a heading, the
 * address, its detail and the way there. `twoLine`: the name with an
 * italic second line under it, as a section's two-line heading.
 */
export function Venue({
  venue,
  twoLine = false,
}: {
  venue: ListItem;
  twoLine?: boolean;
}) {
  const italic = twoLine ? venue.headingItalic : "";
  return (
    <>
      <h3 className={`${H2} mb-3.25 text-[color:var(--m-ink)]`}>
        {venue.venue}
        {venue.venue && italic ? <br /> : null}
        {italic ? (
          <em className="italic text-[color:var(--m-secondary)]">{italic}</em>
        ) : null}
      </h3>
      <p className={`${BODY_SM} ${MUTED} max-w-sm whitespace-pre-line`}>
        {venue.address}
      </p>
      {venue.detail ? (
        <p
          className={`${BODY} mt-6.5 font-semibold whitespace-pre-line text-[color:var(--m-ink)]`}
        >
          {venue.detail}
        </p>
      ) : null}
      <MapsLink href={venue.mapsLink} className={`${INK_LINK} mt-3.5`}>
        <Icon name="arrow-up-right" className={ARROW_NUDGE} />
      </MapsLink>
    </>
  );
}
