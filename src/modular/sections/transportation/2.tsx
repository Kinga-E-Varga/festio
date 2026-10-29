import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import {
  PAD,
  SPLIT,
  SECTION_GROUND,
  otherCard,
  CARD_STACK,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { WayRow } from "./WaysList";

/**
 * A bus on its soft disc over the heading — no eyebrow — beside the ways
 * of arriving, stacked, each a card on the other surface holding the
 * lists' row (`WayRow`): its number, eyebrow, title and text.
 */
export function Variant({ values, ground }: VariantProps) {
  const ways = list(values, "ways").slice(0, 6);

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="bus" values={values} />
      {ways.length > 0 ? (
        <ul className={CARD_STACK}>
          {ways.map((way, index) => (
            <li key={index} className={otherCard(ground)}>
              <WayRow way={way} index={index} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
