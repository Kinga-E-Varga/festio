import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** The countdown reads `moments`: it counts to the first one's time. */
export const section: SectionDefinition = {
  id: "date-time",
  name: { en: "Date & time", ro: "Data și ora", hu: "Dátum és időpont" },
  required: true,
  order: 30,
  menuLabel: { en: "The day", ro: "Ziua", hu: "A nap" },
  variants: [
    {
      id: "1",
      name: { en: "Calendar card", ro: "Card calendar", hu: "Naptárkártya" },
    },
    {
      id: "2",
      name: {
        en: "Accent & big date",
        ro: "Accent și dată mare",
        hu: "Kiemelés és nagy dátum",
      },
      ground: "accent",
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "moments",
      label: {
        en: "parts of the day",
        ro: "momentele zilei",
        hu: "a nap részei",
      },
      type: "list",
      maxItems: 4,
      item: [
        { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "place", label: LABELS.place, type: "text", maxLength: 60 },
      ],
    },
  ],
};
