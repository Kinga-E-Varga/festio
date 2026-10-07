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
        "ways.label",
        "ways.title",
        "ways.text",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă și carduri",
        hu: "Ikon és kártyák",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
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
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 30 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.note, type: "longText", maxLength: 240 },
      ],
    },
  ],
};
