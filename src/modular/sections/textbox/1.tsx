import { PAD, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { hasText, TextBoxWords } from "./TextBoxWords";

/** The words large and centred down a narrow column. */
export function Variant({ values, ground }: VariantProps) {
  if (!hasText(values)) return null;

  return (
    <div className={`${SECTION_GROUND[ground]} ${PAD}`}>
      <TextBoxWords values={values} />
    </div>
  );
}
