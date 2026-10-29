import { FULL_CARD_WIDTH } from "@/modular/FullCard";
import { SectionHeading } from "@/modular/SectionHeading";
import {
  CORNER,
  GROUND_FILL,
  H2_SMALL,
  PAD,
  SECTION_GROUND,
} from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { Record, RECORD_SIZE } from "./Record";

/*
 * The card's padding: a full card's (`FULL_CARD_PAD`), but on a phone room
 * at the top for the record's lower part, and from `@3xl` room at the left
 * for the half of the record over the card and then the right
 * side's 48px, so the words, centred, sit as far from the record as from
 * the card's right edge; 40px over and under them. From `@3xl` the card
 * is at least as tall as the record, the words centred on its
 * height, so the record stays within it and the section's padding runs
 * from the card, as in any other section.
 */
const CARD_PAD =
  "px-6 pt-28 pb-12 @3xl:py-10 @3xl:pr-12 @3xl:pl-[calc(var(--record)/2+48px)]";

/**
 * Simple (`2`) with its words in a full card: the heading, as
 * any section's a step smaller (`H2_SMALL`), and note centred in one card on the section's own
 * ground, as wide as the full cards (`FULL_CARD_WIDTH`), so a loud pattern
 * can stay on the page around it. The record lies over the card: on a phone over its top edge, centred;
 * from `@3xl` centred on the card's left edge, half over the card and
 * half past it: the card starts half a record in, so the two stay
 * within the full cards' width.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div
        className={`relative flex flex-col items-center ${RECORD_SIZE} @3xl:pl-[calc(var(--record)/2)] ${FULL_CARD_WIDTH}`}
      >
        <div className="relative z-10 -mb-20 @3xl:absolute @3xl:top-1/2 @3xl:left-0 @3xl:mb-0 @3xl:-translate-y-1/2">
          <Record on={ground} />
        </div>
        <div
          className={`flex w-full flex-col justify-center @3xl:min-h-(--record) ${GROUND_FILL[ground]} ${CORNER} ${CARD_PAD}`}
        >
          <SectionHeading values={values} headingClass={H2_SMALL} />
        </div>
      </div>
    </div>
  );
}
