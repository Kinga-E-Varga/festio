import { PAD_BOTTOM, PAD_X, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CardText } from "./CardText";
import { hasText } from "./TextBoxWords";

/**
 * Card (`3`) in the band of the section right before, whatever its
 * colour, as the countdown's joined styles share the date's: no top
 * padding of its own; on the accent band its ground turns every colour to
 * the band's ink. The card in the other surface from the band, as Card's
 * (`CardText`): on an accent band, the page's surface.
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}>
      <CardText values={values} ground={ground} framed />
    </div>
  );
}
