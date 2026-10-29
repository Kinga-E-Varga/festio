import { SectionHeading } from "@/modular/SectionHeading";
import { MEASURE, PAD, SECTION_GROUND, STACK } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { StoryText } from "./StoryText";

/**
 * The full cards' heading, its eyebrow and heading only (no italic line, no
 * note), over the story, both centred down a comfortable line length; no
 * photo.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <div className={`${STACK} mx-auto items-center text-center ${MEASURE}`}>
        <SectionHeading values={values} />
        <StoryText values={values} />
      </div>
    </div>
  );
}
