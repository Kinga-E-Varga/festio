import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { GroupList } from "./GroupList";

/** Icon & cards: the heart heading beside each group a card on the other surface, stacked (`GroupList`): no icons or numbers, the text centred. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="heart" values={values} />
      <GroupList groups={list(values, "groups").slice(0, 4)} cards={ground} />
    </div>
  );
}
