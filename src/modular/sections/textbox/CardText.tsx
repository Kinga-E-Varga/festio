import { FULL_CARD } from "@/modular/FullCard";
import { otherGround } from "@/modular/ground";
import { GROUND, HAIRLINE_FRAME } from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { TextBoxWords } from "./TextBoxWords";

/**
 * The words in a full card (`FULL_CARD`). The card on `card`, the other
 * surface from `ground` unless given; with `framed` a hairline round it.
 * Card, Accent & card (`3`, `11`) and Card joined (`4`) framed; Full card
 * (`12`) and Full card accent (`13`) without.
 */
export function CardText({
  values,
  ground,
  card = otherGround(ground),
  framed = false,
}: {
  values: SectionValues;
  ground: SectionGround;
  card?: SectionGround;
  framed?: boolean;
}) {
  return (
    <div
      className={`${FULL_CARD} ${GROUND[card]} ${framed ? HAIRLINE_FRAME : ""}`}
    >
      <TextBoxWords values={values} />
    </div>
  );
}
