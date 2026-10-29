import { PAD_BOTTOM, PAD_X, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { PullQuote } from "./PullQuote";
import { hasText } from "./TextBoxWords";

/**
 * Quote (`8`) in the band of the section right before, whatever its colour,
 * as Simple joined (`5`): no top padding of its own; on the accent band its
 * ground turns every colour to the band's ink.
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}>
      <PullQuote values={values} />
    </div>
  );
}
