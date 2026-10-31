import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, STACK, COLUMN } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StoryBeside } from "./FullCardStory";

/* The full card's content box: its width less its padding (`FULL_CARD_PAD`) and the content's own. */
const CONTENT = `${COLUMN} @3xl:px-12 @5xl:px-24`;

/**
 * On the accent band, the heading centred, as the other Accent styles,
 * over Full card accent's (`7`) photo and story, as wide as that card's
 * content (`StoryBeside`), no card.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <StoryBeside values={values} className={CONTENT} />
    </div>
  );
}
