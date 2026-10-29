import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { GroupList } from "./GroupList";

/** The two-line heading beside the groups as rows, with their icons (`GroupList`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <div>
        <SectionHeading values={values} align="start" />
      </div>
      <GroupList groups={list(values, "groups").slice(0, 4)} icons="end" />
    </div>
  );
}
