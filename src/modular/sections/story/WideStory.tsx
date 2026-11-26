import Image from "next/image";
import { imageSrc, isOn, text } from "@/modular/content";
import { CORNER, MEASURE, STACK } from "@/modular/styles";
import type { SectionValues } from "@/types/modular";
import { StoryText } from "./StoryText";

/**
 * The photo in landscape (3:2) across the whole width it is given, then
 * the story centred under it, in a comfortable line (`MEASURE`). The photo
 * is required while photos are on; while it is missing, or with photos off,
 * the story alone. The photo's description is its alt text; left empty, the
 * photo is decorative. `sizes`: the photo's widest, for `next/image`;
 * `photoWidth`: a narrower photo, centred.
 * Simple (`10`), Accent (`8`) and the full cards (`6`, `9`, `7`).
 */
export function WideStory({
  values,
  sizes,
  photoWidth = "",
  className = "",
}: {
  values: SectionValues;
  sizes: string;
  photoWidth?: string;
  className?: string;
}) {
  const src = isOn(values, "photos") ? imageSrc(text(values, "photo")) : null;

  return (
    <div className={`${STACK} ${className}`}>
      {src ? (
        <div
          className={`relative mx-auto aspect-[3/2] w-full overflow-hidden ${CORNER} ${photoWidth}`}
        >
          <Image
            src={src}
            alt={text(values, "photoAlt")}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      ) : null}
      <StoryText values={values} className={`${MEASURE} mx-auto text-center`} />
    </div>
  );
}
