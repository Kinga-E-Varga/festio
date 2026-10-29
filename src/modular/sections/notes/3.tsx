import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { noteItems } from "@/modular/notes";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { NoteList } from "./NoteList";

/**
 * A compass on its soft disc over the heading — no eyebrow — beside the
 * notes as rows between hairlines (`NoteList`), with no icons. No cards.
 */
export function Variant({ values, related, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} items-start ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="compass" values={values} />
      <NoteList
        items={noteItems(list(values, "items"), values)}
        related={related}
      />
    </div>
  );
}
