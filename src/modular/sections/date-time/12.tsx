import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { BandDate } from "./BandDate";

/** Simple accent's date and note (`BandDate`), on the surface in turn instead of the accent. */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <BandDate values={values} basics={basics} language={language} />
    </div>
  );
}
