import Image from "next/image";
import { imageSrc, text } from "@/modular/content";
import { FullCard } from "@/modular/FullCard";
import { CORNER } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StoryText } from "./StoryText";

/* Half the full card's 960px less its padding, once the two sit side by side. */
const PHOTO_SIZES = "(min-width: 768px) 380px, 100vw";

/**
 * The story as a full card (`FullCard`): the heading centred, then between
 * the card's lines the photo on the left and the story on the right, as
 * Location's Full card spaces a venue and its photo, the pair 48px in from
 * the lines' ends from `@5xl`; on a phone the photo over the story, both
 * centred. The photo is required; while it is missing, the story alone,
 * centred. The photo's description is its alt text; left
 * empty, the photo is decorative.
 */
export function Variant({ values, ground }: VariantProps) {
  const src = imageSrc(text(values, "photo"));

  return (
    <FullCard values={values} ground={ground}>
      <div
        className={`grid items-center gap-6 py-8 @3xl:gap-12 @3xl:py-10 @5xl:px-12 ${src ? "@3xl:grid-cols-2" : ""}`}
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
    </FullCard>
  );
}
