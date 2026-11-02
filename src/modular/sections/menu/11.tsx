import { PAD, SECTION_GROUND, STACK, COLUMN } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CenteredCourses } from "./CenteredCourses";

/** Simple (`3`) on the accent band (`CenteredCourses`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={`${COLUMN} ${STACK} text-center`}>
        <CenteredCourses values={values} />
      </div>
    </div>
  );
}
