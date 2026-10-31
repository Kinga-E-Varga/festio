import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FramedText } from "./FramedText";
import { hasText } from "./TextBoxWords";

/** Framed (`3`) on the accent band, the card on the surface (`FramedText`). */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <FramedText values={values} ground={ground} />
    </div>
  );
}
