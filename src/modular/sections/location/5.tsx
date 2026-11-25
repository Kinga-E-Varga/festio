import { BigIcon } from "@/modular/IconHeading";
import { turnTone } from "@/modular/styles";
import { isIconName } from "@/modular/icons";
import type { VariantProps } from "@/types/modular";
import { VenueRows } from "./VenueRows";

/**
 * Simple with each location's icon over its name on the large soft disc of
 * an icon heading (`BigIcon`), where Simple has the label (`VenueRows`).
 * Like every icon style, always the host's icon: the Use icons and Use
 * numbers switches, set in another style, are ignored here. Photos off too:
 * the icon stays, and the venues are left-aligned, in one row once there is
 * room.
 */
export function Variant({ values, ground }: VariantProps) {
  return (
    <VenueRows
      values={values}
      ground={ground}
      lead={(venue, index) =>
        isIconName(venue.icon) ? (
          <BigIcon
            icon={venue.icon}
            tone={turnTone(index, "secondary")}
            className="mb-6"
          />
        ) : null
      }
      rowWithoutPhotos
    />
  );
}
