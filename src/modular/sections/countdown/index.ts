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
      id: "12",
      name: { en: "Cards soft", ro: "Carduri discrete", hu: "Kártyák, lágy" },
      // Cards hard, the cards on the surface: bare too, the pattern round them.
      bare: true,
      shows: [],
    },
    {
      id: "2",
      name: { en: "Cards hard", ro: "Carduri marcate", hu: "Kártyák, erős" },
      // The page's pattern round the cards, as the Text box's Card; the
      // cards on the second surface.
      bare: true,
      shows: [],
    },
    {
      id: "10",
      name: {
        en: "Cards accent",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Cards, the cards on the accent: bare too, the pattern round them.
      bare: true,
      shows: [],
    },
    {
      id: "3",
      name: {
        en: "Simple joined",
        ro: "Simplu alăturat",
        hu: "Egyszerű csatolt",
      },
      // In the date's band, whatever its colour; no eyebrow.
      ground: "joined",
      shows: [],
    },
    {
      id: "11",
      name: { en: "Sticker", ro: "Autocolant", hu: "Matrica" },
      // Simple joined as the Text box's stickers, no eyebrow.
      ground: "joined",
      bare: true,
      shows: [],
    },
    {
      id: "13",
      name: {
        en: "Cards joined soft",
        ro: "Carduri alăturate discrete",
        hu: "Csatolt kártyák, lágy",
      },
      // Cards joined hard, the cards on the surface.
      ground: "joined",
      shows: [],
    },
    {
      id: "7",
      name: {
        en: "Cards joined hard",
        ro: "Carduri alăturate marcate",
        hu: "Csatolt kártyák, erős",
      },
      // Cards in the date's band, whatever its colour; the cards on the
      // second surface.
      ground: "joined",
      shows: [],
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
      shows: [],
    },
    {
      id: "4",
      name: { en: "Sentence", ro: "Propoziție", hu: "Mondat" },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: [],
    },
    {
      id: "15",
      name: {
        en: "Sentence sticker",
        ro: "Propoziție autocolant",
        hu: "Matricás mondat",
      },
      // Sentence as Sticker's stickers: bare, the pattern round them.
      ground: "joined",
      bare: true,
      shows: [],
    },
    {
      id: "6",
      name: { en: "Clock", ro: "Ceas", hu: "Óra" },
      // In the date's band, whatever its colour.
      ground: "joined",
      shows: [],
    },
    {
      id: "14",
      name: { en: "Clock sticker", ro: "Ceas autocolant", hu: "Matricás óra" },
      // Clock as Sticker's stickers: bare, the pattern round them.
      ground: "joined",
      bare: true,
      shows: [],
    },
  ],
  fields: HEADING_FIELDS.filter(({ id }) => id === "eyebrow"),
};
