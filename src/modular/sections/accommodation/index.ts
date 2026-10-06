import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "accommodation",
  name: { en: "Accommodation", ro: "Cazare", hu: "Szállás" },
  required: false,
  order: 75,
  menuLabel: { en: "Accommodation", ro: "Cazare", hu: "Szállás" },
  variants: [
    {
      id: "1",
      name: { en: "Simple list", ro: "Listă simplă", hu: "Egyszerű lista" },
    },
    {
      id: "2",
      name: {
        en: "Icon & list",
        ro: "Pictogramă și listă",
        hu: "Ikon és lista",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "places",
      label: { en: "places to stay", ro: "locuri de cazare", hu: "szállások" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 60 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 60 },
        {
          id: "distance",
          label: { en: "side note", ro: "notă laterală", hu: "oldaljegyzet" },
          type: "text",
          maxLength: 40,
        },
        { id: "link", label: LABELS.link, type: "text", maxLength: 300 },
      ],
    },
  ],
};
