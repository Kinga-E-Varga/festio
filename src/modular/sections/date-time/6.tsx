import { otherGround } from "@/modular/ground";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { DateBox } from "./DateBox";

/**
 * A calendar on its soft disc over the heading — no eyebrow, no italic
 * line — beside the date in a card on the other surface (`DateBox`).
 */
export function Variant({ values, basics, language, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} items-center ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="calendar" values={values} />
      <DateBox
        date={basics.date}
        language={language}
        ground={otherGround(ground)}
      />
    </div>
  );
}
