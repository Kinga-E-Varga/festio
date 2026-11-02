import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { ITEM_ICON, iconShows, iconSwitches } from "@/modular/item-marks";
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
        ...iconShows("places"),
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
        ...iconShows("places"),
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
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "8",
      name: {
        en: "Cards accent",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Cards, the cards on the accent, every disc in the secondary.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "5",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      // Transportation's Cards as a grid, no lines; no italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "9",
      name: { en: "Grid accent", ro: "Grilă accent", hu: "Rács kiemelt" },
      // Grid on the accent, each stay's icon over its eyebrow.
      ground: "accent",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "7",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // Cards' content, the stays side by side in a full card.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
    {
      id: "10",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Full card on the accent, no lines, every disc in the
      // secondary; always on the page's surface, whatever its turn.
      ground: "surface",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("places"),
        "places.distance",
        "places.name",
        "places.note",
        "places.link",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    ...iconSwitches("places"),
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
        ITEM_ICON,
        // Once a side note, now drawn as the stay's eyebrow; the id stays.
        {
          id: "distance",
          label: LABELS.label,
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
