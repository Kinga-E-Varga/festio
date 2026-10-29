import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { DateBox } from "./DateBox";

/** The heading beside the date in a card on the accent (`DateBox`). */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} items-center ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <DateBox date={basics.date} language={language} ground="accent" />
    </div>
  );
}
