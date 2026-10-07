import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "menu",
  name: { en: "Menu", ro: "Meniu", hu: "Menü" },
  required: false,
  order: 80,
  menuLabel: { en: "Menu", ro: "Meniu", hu: "Menü" },
  // No variant draws an italic second line under the heading.
  variants: [
    {
      id: "1",
      name: { en: "Simple grid", ro: "Grilă simplă", hu: "Egyszerű rács" },
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        // Draws a course's first dish only.
        "courses.title.first",
        "courses.note",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon & card",
        ro: "Pictogramă și card",
        hu: "Ikon és kártya",
      },
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
    {
      id: "3",
      name: {
        en: "Framed card",
        ro: "Card cu ramă",
        hu: "Keretes kártya",
      },
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "courses.label",
        "courses.title",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
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
