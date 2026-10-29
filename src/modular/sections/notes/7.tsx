import { list } from "@/modular/content";
import { noteItems } from "@/modular/notes";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, STACK, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { NoteTiles } from "./NoteTiles";

/** The heading centred — no italic line — over the notes as a grid between hairlines (`NoteTiles`). */
export function Variant({ values, related, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      <SectionHeading values={values} />
      <NoteTiles
        items={noteItems(list(values, "items"), values)}
        related={related}
        ground={ground}
        look="grid"
      />
    </div>
  );
}
