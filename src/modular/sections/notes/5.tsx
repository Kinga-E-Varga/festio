import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { noteItems } from "@/modular/notes";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { NoteList } from "./NoteList";

/**
 * Two-line & list (`4`) with each note a card on the other surface instead
 * of between hairlines, the cards stacked (`NoteList`).
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
        cards={otherGround(ground)}
      />
    </div>
  );
}
