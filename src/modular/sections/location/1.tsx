import { isOn, list } from "@/modular/content";
import { iconMode } from "@/modular/item-marks";
import { SectionHeading } from "@/modular/SectionHeading";
import { PAD, STACK, SECTION_GROUND } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { VenueCards } from "./VenueCards";

/** The section's heading over the location cards, the venues on the accent. */
export function Variant({ values, ground }: VariantProps) {
  return (
    <div className={`${STACK} ${SECTION_GROUND[ground]} ${PAD}`}>
      {/* No italic heading here, even one kept from another variant. */}
      <SectionHeading values={values} />
      <VenueCards
        venues={list(values, "venues")}
        mode={iconMode(values)}
        ground={ground}
        photos={isOn(values, "photos")}
        fill="accent"
      />
    </div>
  );
}
