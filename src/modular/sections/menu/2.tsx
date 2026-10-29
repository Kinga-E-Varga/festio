import { list } from "@/modular/content";
import { IconHeading } from "@/modular/IconHeading";
import type { VariantProps } from "@/types/modular";
import { MenuCard } from "./MenuCard";

/** A meal on its soft disc over the heading — no eyebrow — beside one card (`MenuCard`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <MenuCard
      heading={<IconHeading icon="meal" values={values} align="start-late" />}
      courses={list(values, "courses")}
      ground={ground}
    />
  );
}
