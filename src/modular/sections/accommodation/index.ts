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
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [
        ...HEADING_SHOWS,
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "3",
      name: {
        en: "Two-line & cards",
        ro: "Două rânduri & carduri",
        hu: "Kétsoros & kártyák",
      },
      shows: [
        ...HEADING_SHOWS,
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS,
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "4",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă & carduri",
        hu: "Ikon & kártyák",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS,
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "6",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      // Transportation's Cards; no italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "places.icon",
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "5",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      // Transportation's Cards as a grid; no italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "7",
      name: {
        en: "Full card & grid",
        ro: "Card întreg & grilă",
        hu: "Teljes kártya & rács",
      },
      // Cards' content, the stays side by side in a full card.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "places.icon",
        "places.distance",
        "places.name",
        "places.note",
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
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        // Once a side note, now drawn as the stay's eyebrow; the id stays.
        {
          id: "distance",
          label: LABELS.eyebrow,
          type: "text",
          maxLength: 40,
        },
        { id: "name", label: LABELS.name, type: "text", maxLength: 60 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 60 },
        { id: "link", label: LABELS.link, type: "text", maxLength: 300 },
      ],
    },
  ],
};
