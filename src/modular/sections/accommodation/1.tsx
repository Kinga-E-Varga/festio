import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayList } from "./StayList";

/**
 * The mid band: heading left, the stays right. A stay with a safe
 * web address is a link with an arrow; one without is plain.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${SECTION_GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <StayList places={places} />
    </div>
  );
}
