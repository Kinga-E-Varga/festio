import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Record } from "./Record";

/**
 * Accent (`1`) on the page's surface, taking turns as any section, not on
 * the accent band; the record in the surface's colour, its label the accent.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div
      className={`flex flex-col items-center gap-10 ${SECTION_GROUND[ground]} ${PAD} @3xl:flex-row @3xl:gap-20 @5xl:px-40`}
    >
      <Record on={ground} />
      <div className="min-w-0 flex-1">
        <SectionHeading values={values} align="start" />
      </div>
    </div>
  );
}
