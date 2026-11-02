import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CardText } from "./CardText";
import { hasText } from "./TextBoxWords";

/** Card (`3`) in the band's own colour: a full card. */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <CardText values={values} ground={ground} card={ground} />
    </div>
  );
}
