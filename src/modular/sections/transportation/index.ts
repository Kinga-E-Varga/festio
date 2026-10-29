import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "transportation",
  name: { en: "Transportation", ro: "Transport", hu: "Közlekedés" },
  required: false,
  order: 72,
  menuLabel: { en: "Getting there", ro: "Cum ajungi", hu: "Odajutás" },
  variants: [
    {
      id: "1",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "ways.icon",
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "3",
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [
        ...HEADING_SHOWS,
        "ways.icon",
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "5",
      name: {
        en: "Two-line & cards",
        ro: "Două rânduri & carduri",
        hu: "Kétsoros & kártyák",
      },
      shows: [
        ...HEADING_SHOWS,
        "ways.icon",
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "4",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      // No eyebrow or italic line over the heading.
      shows: [...ICON_HEADING_SHOWS, "ways.label", "ways.title", "ways.text"],
    },
    {
      id: "2",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă & carduri",
        hu: "Ikon & kártyák",
      },
      // No italic second line under the heading.
      shows: [...ICON_HEADING_SHOWS, "ways.label", "ways.title", "ways.text"],
    },
    {
      id: "7",
      name: {
        en: "Wide cards",
        ro: "Carduri late",
        hu: "Széles kártyák",
      },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "ways.icon",
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "6",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      // Cards without icons, as a grid; no italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "8",
      name: {
        en: "Full card & list",
        ro: "Card întreg & listă",
        hu: "Teljes kártya & lista",
      },
      // Cards' (`1`) content, one way under another in a full card.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "ways.icon",
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "ways",
      label: {
        en: "ways to arrive",
        ro: "moduri de a ajunge",
        hu: "érkezési módok",
      },
      itemLabel: { en: "way", ro: "modul", hu: "mód" },
      addLabel: {
        en: "add new way",
        ro: "adaugă un mod nou",
        hu: "új mód hozzáadása",
      },
      type: "list",
      maxItems: 6,
      item: [
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 30 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.note, type: "longText", maxLength: 240 },
      ],
    },
  ],
};
