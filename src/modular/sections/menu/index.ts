import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { ITEM_ICON, iconShows, iconSwitches } from "@/modular/item-marks";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "menu",
  name: { en: "Menu", ro: "Meniu", hu: "Menü" },
  required: false,
  order: 80,
  menuLabel: { en: "Menu", ro: "Meniu", hu: "Menü" },
  variants: [
    {
      id: "1",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("courses"),
        "courses.label",
        "courses.title",
        "courses.note",
      ],
    },
    {
      id: "4",
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [
        ...HEADING_SHOWS,
        ...iconShows("courses"),
        "courses.label",
        "courses.title",
        "courses.note",
      ],
    },
    {
      id: "7",
      name: {
        en: "Two-line & card",
        ro: "Două rânduri & card",
        hu: "Kétsoros & kártya",
      },
      shows: [...HEADING_SHOWS, "courses.label", "courses.title"],
    },
    {
      id: "5",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      shows: [
        ...ICON_HEADING_SHOWS,
        ...iconShows("courses"),
        "courses.label",
        "courses.title",
        "courses.note",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & card",
        ro: "Pictogramă & card",
        hu: "Ikon & kártya",
      },
      shows: [...ICON_HEADING_SHOWS, "courses.label", "courses.title"],
    },
    {
      id: "6",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("courses"),
        "courses.label",
        "courses.title",
        "courses.note",
      ],
    },
    {
      id: "9",
      name: {
        en: "Cards accent",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Cards, the cards on the accent, every disc in the secondary.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...iconShows("courses"),
        "courses.label",
        "courses.title",
        "courses.note",
      ],
    },
    {
      id: "3",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
    {
      id: "11",
      name: {
        en: "Simple accent",
        ro: "Simplu accent",
        hu: "Egyszerű kiemelt",
      },
      // Simple on the accent band.
      ground: "accent",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
    {
      id: "8",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // Simple's fields: every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
    {
      id: "10",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Full card on the accent, Simple's short line under the heading;
      // always on the page's surface, whatever its turn.
      ground: "surface",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    ...iconSwitches("courses"),
    {
      id: "courses",
      label: { en: "courses", ro: "feluri", hu: "fogások" },
      itemLabel: { en: "course", ro: "felul", hu: "fogás" },
      addLabel: {
        en: "add new course",
        ro: "adaugă un fel nou",
        hu: "új fogás hozzáadása",
      },
      type: "list",
      maxItems: 6,
      item: [
        ITEM_ICON,
        {
          id: "label",
          label: { en: "course", ro: "fel", hu: "fogás" },
          type: "text",
          maxLength: 30,
        },
        /* One dish per line, when a course has several. */
        {
          id: "title",
          label: { en: "dish", ro: "preparat", hu: "étel" },
          type: "lines",
          maxLength: 60,
          maxLines: 4,
          addLabel: {
            en: "add new dish",
            ro: "adaugă un preparat nou",
            hu: "új étel hozzáadása",
          },
        },
        { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
      ],
    },
  ],
};
