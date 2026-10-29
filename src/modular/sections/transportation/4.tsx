import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SPLIT, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { WaysList } from "./WaysList";

/**
 * A bus on its soft disc over the heading — no eyebrow — beside the ways
 * of arriving as Two-line & list's list (`WaysList`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="bus" values={values} />
      <WaysList ways={list(values, "ways").slice(0, 6)} />
    </div>
  );
}
