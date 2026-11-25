import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CentredWayCards } from "./WaysList";

/**
 * A bus on its soft disc over the heading — no eyebrow — beside the ways
 * of arriving as centred cards, no icons or numbers (`CentredWayCards`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="bus" values={values} />
      <CentredWayCards
        ways={list(values, "ways").slice(0, 6)}
        ground={ground}
      />
    </div>
  );
}
