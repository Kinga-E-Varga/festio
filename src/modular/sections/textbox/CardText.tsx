import { FULL_CARD } from "@/modular/FullCard";
import { otherGround } from "@/modular/ground";
import { CARD_FILL, GROUND, HAIRLINE_FRAME } from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { TextBoxWords } from "./TextBoxWords";

/**
 * The words in a full card (`FULL_CARD`). The card on `card`, the other
 * surface from `ground` unless given, or with `full` on the fill every full
 * card shares (`CARD_FILL`); with `framed` a hairline round it. Card,
 * Accent & card (`3`, `11`) and Card joined (`4`) framed; Full card (`12`,
 * `full`) and Full card accent (`13`) without.
 */
export function CardText({
  values,
  ground,
  card = otherGround(ground),
  full = false,
  framed = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  card?: SectionGround;
  full?: boolean;
  framed?: boolean;
}) {
  return (
    <div
      className={`${FULL_CARD} ${full ? CARD_FILL : GROUND[card]} ${framed ? HAIRLINE_FRAME : ""}`}
    >
      <TextBoxWords values={values} />
    </div>
  );
}
