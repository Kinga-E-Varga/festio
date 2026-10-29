import { list } from "@/modular/content";
import { noteItems } from "@/modular/notes";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { NoteList } from "./NoteList";

/**
 * The two-line heading beside the notes as rows between hairlines
 * (`NoteList`), with no icons.
 */
export function Variant({ values, related, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <NoteList
        items={noteItems(list(values, "items"), values)}
        related={related}
      />
    </div>
  );
}
