import Image from "next/image";
import { imageSrc, isOn, text } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { CORNER, UNLINED_PULL } from "@/modular/styles";
import type { SectionValues, VariantProps } from "@/types/modular";
import { StoryText } from "./StoryText";

/* Half the full card's 960px less its padding, once the two sit side by side. */
const PHOTO_SIZES = "(min-width: 768px) 380px, 100vw";

/**
 * The story as a full card (`FullCard`): the heading centred, then between
 * the card's lines the photo on the left and the story on the right, as
 * Location's Full card spaces a venue and its photo, the pair 48px in from
 * the lines' ends from `@5xl`; on a phone the photo over the story, both
 * centred. The photo is required while photos are on; while it is missing,
 * or with photos off, the story alone, centred. The photo's description is
 * its alt text; left empty, the photo is decorative. Full card (`6`); with
 * `accent`, the card on the accent and no lines: Full card accent (`7`).
 */
export function FullCardStory({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <StoryBeside
        values={values}
        className={`${accent ? UNLINED_PULL : ""} py-8 @3xl:py-10 @5xl:px-12`}
      />
    </FullCard>
  );
}

/**
 * The full cards' content: the photo on the left and the story on the
 * right, from `@3xl`; on a phone the photo over the story, both centred;
 * without the photo, the story alone, centred. Also Accent (`8`), as wide
 * as the card's content.
 */
export function StoryBeside({
  values,
  className = "",
}: {
  values: SectionValues;
  className?: string;
}) {
  const src = isOn(values, "photos") ? imageSrc(text(values, "photo")) : null;

  return (
    <div
      className={`grid items-center gap-6 @3xl:gap-12 ${src ? "@3xl:grid-cols-2" : ""} ${className}`}
    >
      {src ? (
        <div
          className={`relative aspect-[4/5] w-full max-w-80 justify-self-center overflow-hidden @3xl:max-w-none ${CORNER}`}
        >
          <Image
            src={src}
            alt={text(values, "photoAlt")}
            fill
            sizes={PHOTO_SIZES}
            className="object-cover"
          />
        </div>
      ) : null}
      <StoryText
        values={values}
        className={src ? "text-center @3xl:text-left" : "text-center"}
      />
    </div>
  );
}
