import { list } from "@/modular/content";
import { otherGround } from "@/modular/ground";
import { IconHeading } from "@/modular/IconHeading";
import { noteItems } from "@/modular/notes";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { NoteList } from "./NoteList";

/**
 * Icon & list (`3`) with each note a card on the other surface instead of
 * between hairlines, the cards stacked (`NoteList`); no icons by the notes.
 */
export function Variant({ values, related, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="compass" values={values} />
      <NoteList
        items={noteItems(list(values, "items"), values)}
        related={related}
        cards={otherGround(ground)}
      />
    </div>
  );
}
