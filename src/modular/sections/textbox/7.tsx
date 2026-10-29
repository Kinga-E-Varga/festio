import type { VariantProps } from "@/types/modular";
import { AccentBand } from "./AccentBand";
import { PullQuote } from "./PullQuote";
import { hasText } from "./TextBoxWords";

/** The pull quote (`PullQuote`) on the accent band (`AccentBand`), the large text in the band's ink. */
export function Variant({ values }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <AccentBand>
      <PullQuote values={values} />
    </AccentBand>
  );
}
