import { list } from "@/modular/content";
import { fullCardCell, FullCard, fullCardGrid } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { ItemIcon } from "@/modular/cards/CardIcon";

/* A stay's contents, centred. */
const CELL = "flex flex-col items-center text-center";

/**
 * The stays as a full card, as Contact's Full card: the heading
 * centred, the stays under it between the card's lines, side by side,
 * hairlines between them (`fullCardGrid`). Each stay centred, as a
 * Cards (`6`) card's content: its icon, when it has one, on a soft disc
 * over its eyebrow, every disc in the secondary — then its name and note. A stay with a
 * safe web address is a link, its whole content, with the arrow after its
 * name. Full card (`7`); with `accent`, the card on the accent, no
 * lines, every disc in the palette's secondary (`ItemIcon`'s `accent`): Full card
 * accent (`10`).
 */
export function FullCardStays({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  const places = list(values, "places").slice(0, 6);
  if (places.length === 0) return null;

  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <ol className={fullCardGrid(places.length, accent)}>
        {places.map((place, index) => (
          <li key={index} className={fullCardCell(accent)}>
            <StayCell place={place} className={CELL}>
              <ItemIcon name={place.icon} accent={accent} className="mb-5" />
            </StayCell>
          </li>
        ))}
      </ol>
    </FullCard>
  );
}
