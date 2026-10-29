import { isOn, list } from "@/modular/content";
import { SectionHeading } from "@/modular/SectionHeading";
import { otherGround } from "@/modular/ground";
import { PAD, STACK, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { VenueCards } from "./VenueCards";

/**
 * Accent cards on a surface: the section's heading over the location
 * cards, the venues on the other surface instead of the accent.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      {/* No italic heading here, even one kept from another variant. */}
      <SectionHeading values={values} />
      <VenueCards
        venues={list(values, "venues")}
        ground={ground}
        photos={isOn(values, "photos")}
        fill={otherGround(ground)}
      />
    </div>
  );
}
