import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayList } from "./StayList";

/** Two-line & list (`1`) with each stay a card on the other surface. */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${SECTION_GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <StayList places={places} cards={otherGround(ground)} />
    </div>
  );
}
