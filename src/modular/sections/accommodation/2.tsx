import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { ITEM_TITLE, PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayList } from "./StayList";

/** Stays with a bed on its soft disc over the heading in place of the eyebrow. */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${SECTION_GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <IconHeading icon="bed" values={values} />
      <StayList places={places} nameClass={ITEM_TITLE} />
    </div>
  );
}
