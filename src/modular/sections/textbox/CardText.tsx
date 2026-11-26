import { FULL_CARD } from "@/modular/FullCard";
import { otherGround } from "@/modular/ground";
import { CARD_FILL, COLUMN, GROUND } from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { TextBoxWords } from "./TextBoxWords";

/**
 * The words in a full card (`FULL_CARD`): with `wide` the section's whole
 * content width, as every section's full cards (the Full card styles),
 * else 960px at most (`COLUMN`: the Card styles). The card on `card`, the other
 * surface from `ground` unless given, or with `full` on the fill every full
 * card shares (`CARD_FILL`). Its edge `FULL_CARD`'s: a hairline with the
 * pattern off, none with it on.
 */
export function CardText({
  values,
  ground,
  card = otherGround(ground),
  full = false,
  wide = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  card?: SectionGround;
  full?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`${wide ? "" : COLUMN} ${FULL_CARD} ${full ? CARD_FILL : GROUND[card]}`}
    >
      <TextBoxWords values={values} />
    </div>
  );
}
