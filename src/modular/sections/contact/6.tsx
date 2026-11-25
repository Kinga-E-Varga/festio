import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { PeopleList } from "./PeopleList";

/** Icon & cards: the phone heading beside each person a card on the other surface, stacked (`PeopleList`): no icons or numbers, the text centred. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="phone" values={values} />
      <PeopleList people={list(values, "people").slice(0, 4)} cards={ground} />
    </div>
  );
}
