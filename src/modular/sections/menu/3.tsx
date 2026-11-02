import { PAD, SECTION_GROUND, STACK, COLUMN } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CenteredCourses } from "./CenteredCourses";

/** The menu centred (`CenteredCourses`) on its own band, no card: Simple accent (`11`) on the surface. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={`${COLUMN} ${STACK} text-center`}>
        <CenteredCourses values={values} />
      </div>
    </div>
  );
}
