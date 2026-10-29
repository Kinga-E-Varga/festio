import { list } from "@/modular/content";
import { FULL_CARD_CELL, FullCard, fullCardGrid } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { TurnIcon } from "@/modular/cards/CardIcon";

/* A stay's contents, centred. */
const CELL = "flex flex-col items-center text-center";

/**
 * The stays as a full card, as Contact's Full card & grid: the heading
 * centred, the stays under it between the card's lines, side by side,
 * hairlines between them (`fullCardGrid`). Each stay centred, as a
 * Cards (`6`) card's content: its icon, when it has one, on a soft disc
 * over its eyebrow, the discs taking turns — the 1st, 3rd… in the accent,
 * the 2nd, 4th… in the secondary — then its name and note. A stay with a
 * safe web address is a link, its whole content, with the arrow after its
 * name.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places").slice(0, 6);
  if (places.length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <ol className={fullCardGrid(places.length)}>
        {places.map((place, index) => (
          <li key={index} className={FULL_CARD_CELL}>
            <StayCell place={place} className={CELL}>
              <TurnIcon name={place.icon} index={index} className="mb-5" />
            </StayCell>
          </li>
        ))}
      </ol>
    </FullCard>
  );
}
