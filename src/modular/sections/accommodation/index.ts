import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
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
      shows: [
        ...HEADING_SHOWS,
        "places.name",
        "places.note",
        "places.distance",
        "places.link",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & list",
        ro: "Pictogramă și listă",
        hu: "Ikon és lista",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "places.name",
        "places.note",
        "places.distance",
        "places.link",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "places",
      label: { en: "places to stay", ro: "locuri de cazare", hu: "szállások" },
      itemLabel: { en: "place", ro: "cazarea", hu: "szállás" },
      addLabel: {
        en: "add new place",
        ro: "adaugă o cazare nouă",
        hu: "új szállás hozzáadása",
      },
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
