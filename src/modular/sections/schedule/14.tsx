import { groups } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { AlternateDays } from "./AlternateDays";

/** Alternate's (`13`) days in a full card (`FullCard`), the heading centred over them. */
export function Variant({ values, language, ground }: VariantProps) {
  if (groups(values, "days").length === 0) return null;

  return (
    <FullCard values={values} ground={ground}>
      <AlternateDays values={values} language={language} />
    </FullCard>
  );
}
