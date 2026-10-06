import { HEADING_FIELDS } from "@/modular/heading";
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
      name: { en: "Simple grid", ro: "Grilă simplă", hu: "Egyszerű rács" },
    },
    {
      id: "2",
      name: {
        en: "Icon & card",
        ro: "Pictogramă și card",
        hu: "Ikon és kártya",
      },
    },
    {
      id: "3",
      name: {
        en: "Framed card",
        ro: "Card cu ramă",
        hu: "Keretes kártya",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "courses",
      label: { en: "courses", ro: "feluri", hu: "fogások" },
      type: "list",
      maxItems: 4,
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
          label: LABELS.title,
          type: "longText",
          maxLength: 120,
        },
        { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
      ],
    },
  ],
};
