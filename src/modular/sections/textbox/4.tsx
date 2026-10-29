import { PAD_BOTTOM, PAD_X, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FramedText } from "./FramedText";
import { hasText } from "./TextBoxWords";

/**
 * Framed (`3`) in the band of the section right before, whatever its
 * colour, as the countdown's joined styles share the date's: no top
 * padding of its own; on the accent band its ground turns every colour to
 * the band's ink, the card keeping the page's. The card on the
 * surface, as Framed's.
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}>
      <FramedText values={values} ground={ground} card="surface" />
    </div>
  );
}
