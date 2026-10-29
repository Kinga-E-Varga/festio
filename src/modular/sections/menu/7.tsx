import { list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import type { VariantProps } from "@/types/modular";
import { MenuCard } from "./MenuCard";

/** Icon & card (`2`) with the two-line heading, eyebrow and all, beside the card (`MenuCard`). */
export function Variant({ values, ground }: VariantProps) {
  return (
    <MenuCard
      heading={
        <div>
          <SectionHeading values={values} align="start-late" />
        </div>
      }
      courses={list(values, "courses")}
      ground={ground}
    />
  );
}
