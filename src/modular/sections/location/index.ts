import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/**
 * One to three locations, each with its own venue, address and photo — the
 * invitation's, not the event's.
 */
export const section: SectionDefinition = {
  id: "location",
  name: { en: "Location", ro: "Locația", hu: "Helyszín" },
  required: true,
  order: 50,
  variants: [
    {
      id: "1",
      name: {
        en: "Photo cards",
        ro: "Carduri cu fotografie",
        hu: "Fotós kártyák",
      },
    },
    {
      id: "2",
      name: {
        en: "Icon & photo",
        ro: "Pictogramă și fotografie",
        hu: "Ikon és fotó",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "venues",
      label: { en: "locations", ro: "locații", hu: "helyszínek" },
      type: "list",
      maxItems: 3,
      item: [
        {
          id: "label",
          label: {
            en: "line above the venue",
            ro: "rândul de deasupra locației",
            hu: "sor a helyszín fölött",
          },
          type: "text",
          maxLength: 40,
        },
        { id: "venue", label: LABELS.place, type: "text", maxLength: 80 },
        {
          id: "address",
          label: LABELS.address,
          type: "longText",
          maxLength: 160,
        },
        {
          id: "detail",
          label: {
            en: "line under the venue",
            ro: "rând sub locație",
            hu: "sor a helyszín alatt",
          },
          type: "text",
          maxLength: 80,
        },
        { id: "photo", label: LABELS.photo, type: "image", maxLength: 300 },
      ],
    },
  ],
};
