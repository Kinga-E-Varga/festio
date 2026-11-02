import { BIG_DISC, BigIcon } from "@/modular/IconHeading";
import { iconMode, itemMark } from "@/modular/item-marks";
import { H4, TONES } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";
import { VenueRows } from "./VenueRows";

/**
 * Simple with each location's mark (`itemMark`: the host's icon, or its
 * number) over its name on the large soft disc of an icon heading
 * (`BigIcon`), where Simple has the label (`VenueRows`). Photos off too: the
 * mark stays, and the venues are left-aligned, in one row once there is
 * room.
 */
export function Variant({ values, ground }: VariantProps) {
  const mode = iconMode(values);
  return (
    <VenueRows
      values={values}
      ground={ground}
      lead={(venue, index) => {
        const mark = itemMark(mode, venue.icon, index);
        if (!mark) return null;
        return "icon" in mark ? (
          <BigIcon icon={mark.icon} className="mb-6" />
        ) : (
          <span className={`${BIG_DISC} ${TONES.secondary} ${H4} mb-6`}>
            {mark.number}
          </span>
        );
      }}
      rowWithoutPhotos
    />
  );
}
