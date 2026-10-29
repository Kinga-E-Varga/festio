import { IconHeading } from "@/modular/IconHeading";
import type { VariantProps } from "@/types/modular";
import { PhotoStory } from "./PhotoStory";

/**
 * Two-line & photo (`1`) with a sparkle on its soft disc over the heading in
 * place of the eyebrow, as the other Icon styles (`PhotoStory`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <PhotoStory
      values={values}
      ground={ground}
      heading={(align) => (
        <IconHeading icon="sparkle" values={values} align={align} />
      )}
    />
  );
}
