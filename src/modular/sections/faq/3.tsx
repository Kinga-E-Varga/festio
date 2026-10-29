import { list, text } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, PAD, STACK, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { FaqList } from "./FaqList";

/**
 * As Dress code's and Gifts' Card: the heading centred — no italic line —
 * over the questions as Icon & bars' bars on the other surface
 * (`FaqList`), two side by side from `@3xl`, down the middle (`COLUMN`),
 * the link to the reply form the last bar, in the secondary.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <div className={COLUMN}>
        <FaqList
          items={list(values, "items")}
          box={otherGround(ground)}
          columns
          ask={text(values, "linkLabel")}
        />
      </div>
    </div>
  );
}
