import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { WideStory } from "./WideStory";

/* A little narrower than the card's content: 672px at most (`max-w-2xl`), the page's width below that. */
const PHOTO_WIDTH = "max-w-2xl";
const PHOTO_SIZES = "(min-width: 768px) 672px, 100vw";

/**
 * The story as a full card (`FullCard`): the heading centred, then the
 * photo, a little narrower than the card, and the story centred under it (`WideStory`), as
 * Simple and Accent lay them out. Full card soft (`6`), Full card hard
 * (`9`); with `accent`, the card on the accent: Full card accent (`7`).
 */
export function FullCardStory({
  values,
  ground,
  accent = false,
}: VariantProps & { accent?: boolean }) {
  return (
    <FullCard values={values} ground={ground} accent={accent}>
      <WideStory values={values} sizes={PHOTO_SIZES} photoWidth={PHOTO_WIDTH} />
    </FullCard>
  );
}
