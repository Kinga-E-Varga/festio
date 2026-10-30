import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { hasText, TextBoxWords } from "./TextBoxWords";

/**
 * Simple (`1`) with the large text as the title's stickers: medium, in the
 * ink, an outline in the surface round each letter, shown with a pattern on
 * (`TEXT_CUT`). On its own ground, unlike Sticker joined (`6`).
 */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <TextBoxWords values={values} sticker />
    </div>
  );
}
