import { PAD_BOTTOM, PAD_X, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { hasText, TextBoxWords } from "./TextBoxWords";

/**
 * Simple joined (`5`) with the large text as the title's stickers: medium,
 * in the ink, an outline in the surface round each letter, shown
 * with a pattern on (`TEXT_CUT`). In the band of the section right before,
 * no top padding of its own; on the accent band its ground turns every
 * colour to the band's ink.
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD_X} ${PAD_BOTTOM}`}>
      <TextBoxWords values={values} sticker />
    </div>
  );
}
