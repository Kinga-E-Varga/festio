import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
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
      // Every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.photo",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & photo",
        ro: "Pictogramă și fotografie",
        hu: "Ikon és fotó",
      },
      shows: [
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.detail",
        "venues.photo",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "venues",
      label: { en: "locations", ro: "locații", hu: "helyszínek" },
      itemLabel: { en: "location", ro: "locația", hu: "helyszín" },
      addLabel: {
        en: "add new location",
        ro: "adaugă o locație nouă",
        hu: "új helyszín hozzáadása",
      },
      type: "list",
      maxItems: 3,
      minItems: 1,
      item: [
        {
          id: "label",
          label: {
            en: "what happens here",
            ro: "ce are loc aici",
            hu: "mi lesz itt",
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
          label: LABELS.note,
          type: "longText",
          maxLength: 80,
        },
        { id: "photo", label: LABELS.photo, type: "image", maxLength: 300 },
      ],
    },
  ],
};
