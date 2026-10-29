import type { VariantProps } from "@/types/modular";
import { AccentBand } from "./AccentBand";
import { hasText, TextBoxWords } from "./TextBoxWords";

/** Simple (`1`) on the accent band (`AccentBand`), the large text in the band's ink. */
export function Variant({ values }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <AccentBand>
      <TextBoxWords values={values} />
    </AccentBand>
  );
}
