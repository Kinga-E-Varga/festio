import { HEADING_FIELDS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/** Right under the date. Counts to the start of its day, then says the day has come. */
export const section: SectionDefinition = {
  id: "countdown",
  name: { en: "Countdown", ro: "Numărătoare inversă", hu: "Visszaszámlálás" },
  required: false,
  order: 40,
  variants: [
    {
      id: "1",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: ["eyebrow"],
    },
    {
      id: "2",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      shows: ["eyebrow"],
    },
  ],
  fields: HEADING_FIELDS.filter(({ id }) => id === "eyebrow"),
};
