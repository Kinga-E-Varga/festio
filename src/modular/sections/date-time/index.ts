import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "date-time",
  name: { en: "Date & time", ro: "Data și ora", hu: "Dátum és időpont" },
  required: true,
  order: 30,
  fields: [
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
      fallback: [
        {
          time: "16:00",
          title: { en: "Ceremony", ro: "Ceremonia", hu: "Szertartás" },
          place: {
            en: "The walled garden",
            ro: "Grădina cu ziduri",
            hu: "A fallal körülvett kert",
          },
        },
        {
          time: "18:30",
          title: { en: "Reception", ro: "Recepția", hu: "Fogadás" },
          place: {
            en: "Dinner in the main hall",
            ro: "Cina în salonul mare",
            hu: "Vacsora a nagyteremben",
          },
        },
        {
          time: "21:00",
          title: { en: "Party", ro: "Petrecerea", hu: "Buli" },
          place: { en: "Until late", ro: "Până târziu", hu: "Késő éjszakáig" },
        },
      ],
    },
  ],
};
