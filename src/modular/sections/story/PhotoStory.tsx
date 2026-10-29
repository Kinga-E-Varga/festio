import Image from "next/image";
import type { ReactNode } from "react";
import { imageSrc, text } from "@/modular/content";
import {
  CORNER,
  MEASURE,
  PAD,
  SECTION_GROUND,
  SPLIT,
  STACK,
} from "@/modular/styles";
import type { SectionGround, SectionValues } from "@/types/modular";
import { StoryText } from "./StoryText";

/* The heading's column of `SPLIT`, about 500px at most, side by side; 320px at most stacked. */
const PHOTO_SIZES = "(min-width: 768px) 500px, 320px";

/* Each column in from its sides once there is room: 40px from `@5xl`, 64px from `@7xl`; none narrower, where the two columns are tight already. */
const COLUMN_PAD = "@5xl:px-10 @7xl:px-16";

/**
 * The two-column layout of the other sections (`SPLIT`), the photo where
 * their heading goes, the two centred on each other's height, the heading and the story in the content's column;
 * on a phone the photo over them, 320px wide at most, centred. The photo is required; while it is
 * missing, the heading and the story alone, centred. The photo's
 * description is its alt text; left empty, the photo is decorative.
 * `heading` draws the variant's heading, centred or from the start.
 * Two-line & photo (`1`) and Icon & photo (`4`).
 */
export function PhotoStory({
  values,
  ground,
  heading,
}: {
  values: SectionValues;
  ground: SectionGround;
  heading: (align: "center" | "start") => ReactNode;
}) {
  const src = imageSrc(text(values, "photo"));

  if (!src) {
    return (
      <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
        <div className={`${STACK} mx-auto items-center text-center ${MEASURE}`}>
          {heading("center")}
          <StoryText values={values} />
        </div>
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
        {heading("start")}
        <StoryText values={values} className="text-center @3xl:text-left" />
      </div>
    </div>
  );
}
