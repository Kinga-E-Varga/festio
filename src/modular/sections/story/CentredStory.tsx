import { SectionHeading } from "@/modular/SectionHeading";
import { COLUMN, PAD, SECTION_GROUND, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { WideStory } from "./WideStory";

/* The photo across the column: 960px at most, the page's width below that. */
const PHOTO_SIZES = "(min-width: 960px) 960px, 100vw";

/**
 * One centred column, like a magazine opener: the heading, then the photo
 * across the column (`COLUMN`) and the story under it (`WideStory`), no
 * card. On the section's ground: its turn of the surfaces in Simple
 * (`10`), the accent band in Accent (`8`).
 */
export function CentredStory({ values, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <WideStory values={values} sizes={PHOTO_SIZES} className={COLUMN} />
    </div>
  );
}
