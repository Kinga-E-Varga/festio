import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { PeopleList } from "./PeopleList";

/** Two-line & list (`3`) with each person a card on the other surface, stacked (`PeopleList`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <PeopleList people={list(values, "people").slice(0, 4)} cards={ground} />
    </div>
  );
}
