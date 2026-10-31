import { IconHeading } from "@/modular/IconHeading";
import type { VariantProps } from "@/types/modular";
import { PhotoStory } from "./PhotoStory";

/**
 * Two-line (`1`) with a sparkle on its soft disc over the heading in
 * place of the eyebrow, as the other Icon styles (`PhotoStory`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <PhotoStory
      values={values}
      ground={ground}
      heading={<IconHeading icon="sparkle" values={values} />}
    />
  );
}
