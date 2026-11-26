import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CardText } from "./CardText";
import { hasText } from "./TextBoxWords";

/** The words in a card (`CardText`) in the fill every full card shares (`CARD_FILL`): a full card. */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <CardText values={values} ground={ground} full wide />
    </div>
  );
}
