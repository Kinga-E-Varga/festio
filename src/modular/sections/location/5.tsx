import { BigIcon } from "@/modular/IconHeading";
import { isIconName } from "@/modular/icons";
import type { ListItem, VariantProps } from "@/types/modular";
import { VenueRows } from "./VenueRows";

/**
 * Simple with each location's icon, the host's pick, over its name on
 * the large soft disc of an icon heading (`BigIcon`), where Simple has the
 * label (`VenueRows`). Photos off too: the icon stays, and the venues are
 * left-aligned, in one row once there is room.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <VenueRows values={values} ground={ground} lead={icon} rowWithoutPhotos />
  );
}

function icon(venue: ListItem) {
  return isIconName(venue.icon) ? (
    <BigIcon icon={venue.icon} className="mb-6" />
  ) : null;
}
