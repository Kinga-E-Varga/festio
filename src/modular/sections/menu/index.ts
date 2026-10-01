import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "menu",
  name: { en: "Menu", ro: "Meniu", hu: "Menü" },
  required: false,
  order: 90,
  menuLabel: { en: "Menu", ro: "Meniu", hu: "Menü" },
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 40,
      fallback: { en: "At the table", ro: "La masă", hu: "Az asztalnál" },
    },
    {
      id: "courses",
      label: { en: "courses", ro: "feluri", hu: "fogások" },
      type: "list",
      maxItems: 6,
      item: [
        {
          id: "course",
          label: { en: "course", ro: "fel", hu: "fogás" },
          type: "text",
          maxLength: 30,
        },
        {
          id: "dishes",
          label: { en: "dishes", ro: "preparate", hu: "ételek" },
          type: "longText",
          maxLength: 200,
        },
      ],
      fallback: [
        {
          course: { en: "To start", ro: "Pentru început", hu: "Előétel" },
          dishes: {
            en: "Smoked trout, pickled cucumber, dill\nRoast beetroot, walnut, goat cheese",
            ro: "Păstrăv afumat, castravete murat, mărar\nSfeclă coaptă, nucă, brânză de capră",
            hu: "Füstölt pisztráng, savanyú uborka, kapor\nSült cékla, dió, kecskesajt",
          },
        },
        {
          course: { en: "Main", ro: "Fel principal", hu: "Főétel" },
          dishes: {
            en: "Slow lamb shoulder, spring peas\nWild mushroom orzotto (v)",
            ro: "Spată de miel gătită lent, mazăre verde\nOrzotto cu ciuperci de pădure (v)",
            hu: "Lassan sült báránylapocka, zöldborsó\nErdei gombás orzotto (v)",
          },
        },
        {
          course: { en: "Dessert", ro: "Desert", hu: "Desszert" },
          dishes: {
            en: "Elderflower & strawberry tart\nLate-night sour cherry pie",
            ro: "Tartă cu flori de soc și căpșuni\nPlăcintă cu vișine pentru miezul nopții",
            hu: "Bodzás-epres pite\nÉjféli meggyes pite",
          },
        },
      ],
    },
    {
      id: "footnote",
      label: LABELS.note,
      type: "text",
      maxLength: 120,
      fallback: {
        en: "A separate children's menu — tell us ages in your reply.",
        ro: "Există un meniu separat pentru copii — spune-ne vârstele în răspuns.",
        hu: "Külön gyerekmenü is van — a válaszban jelezd a korosztályt.",
      },
    },
  ],
};
