import { SectionHeading } from "@/modular/SectionHeading";
import type { VariantProps } from "@/types/modular";
import { PhotoStory } from "./PhotoStory";

/** The two-line heading and the story beside the photo (`PhotoStory`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <PhotoStory
      values={values}
      ground={ground}
      heading={(align) => <SectionHeading values={values} align={align} />}
    />
  );
}
