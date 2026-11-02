import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CardText } from "./CardText";
import { hasText } from "./TextBoxWords";

/** Card (`3`) on the accent band, the card on the surface (`CardText`). */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <CardText values={values} ground={ground} framed />
    </div>
  );
}
