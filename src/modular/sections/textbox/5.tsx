import { PAD_BOTTOM, PAD_X, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { hasText, TextBoxWords } from "./TextBoxWords";

/**
 * Simple (`1`) in the band of the section right before, whatever its
 * colour, as the countdown's joined styles share the date's: no top
 * padding of its own; on the accent band its ground turns every colour to
 * the band's ink.
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}>
      <TextBoxWords values={values} />
    </div>
  );
}
