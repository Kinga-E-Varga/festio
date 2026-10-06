import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "schedule",
  name: { en: "Schedule", ro: "Program", hu: "Program" },
  required: false,
  order: 70,
  menuLabel: { en: "Schedule", ro: "Program", hu: "Program" },
  variants: [
    {
      id: "1",
      name: {
        en: "List with icons",
        ro: "Listă cu pictograme",
        hu: "Lista ikonokkal",
      },
    },
    {
      id: "2",
      name: {
        en: "Icon and list",
        ro: "Pictogramă și listă",
        hu: "Ikon és lista",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "days",
      label: { en: "days", ro: "zile", hu: "napok" },
      type: "groups",
      maxGroups: 4,
      group: [
        {
          id: "label",
          label: { en: "day", ro: "ziua", hu: "nap" },
          type: "text",
          maxLength: 40,
        },
      ],
      items: {
        label: { en: "events", ro: "evenimente", hu: "programpontok" },
        maxItems: 6,
        item: [
          { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
          { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
          { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
          { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        ],
      },
    },
  ],
};
