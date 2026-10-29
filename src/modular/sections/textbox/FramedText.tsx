import { FULL_CARD_PAD, FULL_CARD_WIDTH } from "@/modular/FullCard";
import { otherGround } from "@/modular/ground";
import { GROUND, HAIRLINE_FRAME } from "@/modular/styles";
import type { Ground, SectionGround, SectionValues } from "@/types/modular";
import { TextBoxWords } from "./TextBoxWords";

/**
 * The words in one card down the middle, inside a double hairline frame,
 * as Menu's Framed card: a hairline, a gap of the card's own surface, a
 * second hairline. The card on `card`, the other surface from `ground`
 * unless given. Framed
 * (`3`) and Framed joined (`4`).
 */
export function FramedText({
  values,
  ground,
  card = otherGround(ground),
}: {
  values: SectionValues;
  ground: SectionGround;
  card?: Ground;
}) {
  return (
    <div
      className={`${FULL_CARD_WIDTH} p-2.5 ${HAIRLINE_FRAME} ${GROUND[card]}`}
    >
      <div className={`${HAIRLINE_FRAME} ${FULL_CARD_PAD}`}>
        <TextBoxWords values={values} />
      </div>
    </div>
  );
}
