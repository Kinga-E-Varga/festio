import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { CentredWayCards } from "./WaysList";

/** The two-line heading beside the ways as Icon & cards' (`2`) cards: centred, no icons or numbers (`CentredWayCards`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <CentredWayCards
        ways={list(values, "ways").slice(0, 6)}
        ground={ground}
      />
    </div>
  );
}
