import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { PullQuote } from "./PullQuote";
import { hasText } from "./TextBoxWords";

/** Quote accent (`7`) on the page's surface, taking its turn as any section. */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <PullQuote values={values} />
    </div>
  );
}
