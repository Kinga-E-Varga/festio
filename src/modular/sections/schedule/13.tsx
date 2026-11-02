import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { AlternateDays } from "./AlternateDays";

/** The heading centred over the days, each event split at the middle by a line (`AlternateDays`); no card. */
export function Variant({ values, language, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <AlternateDays values={values} language={language} />
    </div>
  );
}
