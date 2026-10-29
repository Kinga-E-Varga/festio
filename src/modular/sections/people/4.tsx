import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { GroupList } from "./GroupList";

/**
 * A heart on its soft disc over the heading — no eyebrow — beside the
 * groups as rows, each its own icon before it, bare, as Transportation's
 * Icon & list numbers its ways (`GroupList`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="heart" values={values} />
      <GroupList groups={list(values, "groups").slice(0, 4)} icons="start" />
    </div>
  );
}
