import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import { ITEM_TITLE, PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StayList } from "./StayList";

/** The two-line heading beside the stays as Icon & cards' (`4`) cards: centred, no icons or numbers. */
export function Variant({ values, ground }: VariantProps) {
  const places = list(values, "places");

  return (
    <div
      className={`${SPLIT} items-start ${SECTION_GROUND[ground]} text-[color:var(--m-ink)] ${PAD}`}
    >
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <StayList
        places={places}
        nameClass={ITEM_TITLE}
        cards={otherGround(ground)}
      />
    </div>
  );
}
