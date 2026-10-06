import { HEADING_FIELDS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/** Right under date & time. Counts to the first part of the day (`reads`). */
export const section: SectionDefinition = {
  id: "countdown",
  name: { en: "Countdown", ro: "Numărătoare inversă", hu: "Visszaszámlálás" },
  required: false,
  order: 40,
  reads: ["date-time"],
  variants: [
    {
      id: "1",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      // In date & time's band, whatever its colour.
      ground: "joined",
    },
    {
      id: "2",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
    },
  ],
  fields: [...HEADING_FIELDS],
};
