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
      shows: ["eyebrow"],
    },
    {
      id: "9",
      name: {
        en: "Simple accent",
        ro: "Simplu accent",
        hu: "Egyszerű kiemelt",
      },
      // Simple on the accent.
      ground: "accent",
      shows: ["eyebrow"],
    },
    {
      id: "5",
      name: {
        en: "Days first",
        ro: "Zilele în prim-plan",
        hu: "Napok előtérben",
      },
      shows: [],
    },
    {
      id: "2",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      shows: ["eyebrow"],
    },
    {
      id: "3",
      name: {
        en: "Simple joined",
        ro: "Simplu alăturat",
        hu: "Egyszerű csatolt",
      },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: ["eyebrow"],
    },
    {
      id: "7",
      name: {
        en: "Cards joined",
        ro: "Carduri alăturate",
        hu: "Csatolt kártyák",
      },
      // Cards in the date's band, whatever its colour.
      ground: "joined",
      shows: ["eyebrow"],
    },
    {
      id: "8",
      name: {
        en: "Cards joined accent",
        ro: "Carduri alăturate accent",
        hu: "Kiemelt csatolt kártyák",
      },
      // Cards joined, the cards on the accent.
      ground: "joined",
      shows: ["eyebrow"],
    },
    {
      id: "4",
      name: {
        en: "Sentence joined",
        ro: "Propoziție alăturată",
        hu: "Csatolt mondat",
      },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: [],
    },
    {
      id: "6",
      name: {
        en: "Clock joined",
        ro: "Ceas alăturat",
        hu: "Csatolt óra",
      },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: [],
    },
  ],
  fields: HEADING_FIELDS.filter(({ id }) => id === "eyebrow"),
};
