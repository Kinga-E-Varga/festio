import Image from "next/image";
import type { ReactNode } from "react";
import { imageSrc, isOn, text } from "@/modular/content";
import { CORNER, PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { StoryText } from "./StoryText";

/* The heading's column of `SPLIT`, about 500px at most, side by side; 320px at most stacked. */
const PHOTO_SIZES = "(min-width: 768px) 500px, 320px";

/* Each column in from its sides once there is room: 40px from `@5xl`, 64px from `@7xl`; none narrower, where the two columns are tight already. */
const COLUMN_PAD = "@5xl:px-10 @7xl:px-16";

/**
 * The two-column layout of the other sections (`SPLIT`), the photo where
 * their heading goes, the two centred on each other's height, the heading and the story in the content's column;
 * on a phone the photo over them, 320px wide at most, centred. The photo is
 * required while photos are on; while it is missing, or with photos off,
 * the heading in its column and the story beside it, as the other
 * sections' heading and content. The photo's description is its alt text;
 * left empty, the photo is decorative. `heading` is the variant's heading,
 * from the start. Two-line (`1`) and Icon (`4`).
 */
export function PhotoStory({
  values,
  ground,
  heading,
}: {
  values: SectionValues;
  ground: SectionGround;
  heading: ReactNode;
}) {
  const src = isOn(values, "photos") ? imageSrc(text(values, "photo")) : null;

  if (!src) {
    return (
      <div className={`${SPLIT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
        {heading}
        <StoryText values={values} className="text-center @3xl:text-left" />
      </div>
    );
  }

  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div
        className={`w-full max-w-80 self-center justify-self-center @3xl:max-w-none ${COLUMN_PAD}`}
      >
        <div
          className={`relative aspect-[4/5] w-full overflow-hidden ${CORNER}`}
        >
          <Image
            src={src}
            alt={text(values, "photoAlt")}
            fill
            sizes={PHOTO_SIZES}
            className="object-cover"
          />
        </div>
      </div>
      <div className={`flex flex-col gap-6 self-center ${COLUMN_PAD}`}>
        {heading}
        <StoryText values={values} className="text-center @3xl:text-left" />
      </div>
    </div>
  );
}
