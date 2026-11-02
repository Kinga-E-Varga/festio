import { isOn, list } from "@/modular/content";
import { FULL_CARD_CELL, FullCard, fullCardGrid } from "@/modular/FullCard";
import { SECTION_GROUND, UNLINED_PULL } from "@/modular/styles";
import type { SectionGround, VariantProps } from "@/types/modular";
import { iconMode, itemMark } from "@/modular/item-marks";
import { VenueRow, VenueText } from "./ListGridVenues";

/**
 * Grid (`3`) as a full card (`FullCard`): the heading centred, the
 * locations under it, no lines. With photos, a list: one
 * row each — the photo (left, then right, in turn), the label, venue,
 * address and detail, and the way there. The photo is required while photos are on;
 * while it is missing the other surface stands in. With photos off, the
 * venues side by side (`fullCardGrid`). Either way each venue's
 * icon, when it has one, on a soft disc over its label, every disc in the secondary, as Accommodation's Full card. Full card
 * (`8`); with `accent`, the card on the accent, and every icon in
 * the palette's own secondary: Full card accent (`10`).
 */
export function FullCardVenues({
  values,
  ground: section,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const venues = list(values, "venues");
  if (venues.length === 0) return null;
  const photos = isOn(values, "photos");
  const mode = iconMode(values);
  const ground: SectionGround = accent ? "accent" : section;

  return (
    <FullCard values={values} ground={section} accent={accent}>
      {photos ? (
        <ol className={`${UNLINED_PULL} text-center`}>
          {venues.map((venue, index) => (
            <VenueRow
              key={index}
              venue={venue}
              ground={ground}
              index={index}
              mark={itemMark(mode, venue.icon, index)}
              accent={accent}
            />
          ))}
        </ol>
      ) : (
        /* Side by side, no lines between. */
        <ol className={fullCardGrid(venues.length)}>
          {venues.map((venue, index) => (
            <li
              key={index}
              className={`${SECTION_GROUND[ground]} ${FULL_CARD_CELL}`}
            >
              <VenueText
                venue={venue}
                mark={itemMark(mode, venue.icon, index)}
                accent={accent}
              />
            </li>
          ))}
        </ol>
      )}
    </FullCard>
  );
}
