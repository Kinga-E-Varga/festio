import { HEADING_FIELDS } from "@/modular/heading";
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
    },
    {
      id: "2",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă și carduri",
        hu: "Ikon és kártyák",
      },
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
      type: "list",
      maxItems: 4,
      item: [
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 30 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.text, type: "longText", maxLength: 240 },
      ],
    },
  ],
};
