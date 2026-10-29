import { list } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { StayCell } from "./StayList";
import { TurnIcon } from "@/modular/cards/CardIcon";

/* A stay's contents, centred. */
const CELL = "flex flex-col items-center text-center";

/**
 * Transportation's Full card & list (`8`) for the stays: the heading
 * centred, the stays under it between the card's lines, one under
 * another, a line across the card between each. Each stay centred, as a
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
      <ol className="divide-y-1 divide-[var(--m-line)]">
        {places.map((place, index) => (
          <li key={index} className={`${CELL} py-8 @3xl:py-10`}>
            <StayCell place={place} className={CELL}>
              <TurnIcon name={place.icon} index={index} className="mb-5" />
            </StayCell>
          </li>
        ))}
      </ol>
    </FullCard>
  );
}
