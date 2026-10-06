import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { GROUND, PAD, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayList } from "./StayList";

/**
 * The mid band: heading left, the stays right. A stay with a safe
 * web address is a link with an arrow; one without is plain. On a phone
 * the side note moves under the name.
 */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <StayList places={places} />
    </div>
  );
}
