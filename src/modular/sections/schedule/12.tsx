import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { TimelineDays } from "./Timeline";

/**
 * Timeline (`4`) in a full card (`FullCard`) on its own ground: the heading
 * centred over the timeline, no lines across the card.
 */
export function Variant({ values, language, ground }: VariantProps) {
  return (
    <FullCard values={values} ground={ground}>
      <TimelineDays values={values} language={language} />
    </FullCard>
  );
}
