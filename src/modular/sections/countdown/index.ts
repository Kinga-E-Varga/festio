import { headingFields } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/** Right under date & time, in its band. Counts to the first part of the day (`reads`). */
export const section: SectionDefinition = {
  id: "countdown",
  name: { en: "Countdown", ro: "Numărătoare inversă", hu: "Visszaszámlálás" },
  required: false,
  order: 40,
  ground: "joined",
  reads: ["date-time"],
  fields: headingFields({
    eyebrow: {
      en: "Counting the days",
      ro: "Numărăm zilele",
      hu: "Számoljuk a napokat",
    },
  }),
};
