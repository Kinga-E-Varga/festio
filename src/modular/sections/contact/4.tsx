import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import { PAD, SECTION_GROUND, SPLIT } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { PeopleList } from "./PeopleList";

/**
 * A phone on its soft disc over the heading — no eyebrow — beside the
 * people as rows, numbered, as Accommodation's Icon & list (`PeopleList`).
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${SPLIT} ${SECTION_GROUND[ground]} ${PAD}`}>
      <IconHeading icon="phone" values={values} />
      <PeopleList people={list(values, "people").slice(0, 4)} numbered />
    </div>
  );
}
