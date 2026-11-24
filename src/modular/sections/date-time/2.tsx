import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { BandDate } from "./BandDate";

/** The date and its note (`BandDate`) on an accent band. */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <BandDate values={values} basics={basics} language={language} />
    </div>
  );
}
