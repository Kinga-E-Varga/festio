import { FullCard } from "@/modular/FullCard";
import type { VariantProps } from "@/types/modular";
import { StoryText } from "./StoryText";

/**
 * Full card & photo (`6`) without the photo: the heading centred in a full
 * card (`FullCard`), the story centred between its lines.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <FullCard values={values} ground={ground}>
      <div className="py-8 @3xl:py-10 @5xl:px-12">
        <StoryText values={values} className="text-center" />
      </div>
    </FullCard>
  );
}
