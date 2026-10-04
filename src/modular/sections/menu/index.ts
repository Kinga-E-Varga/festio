import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "menu",
  name: { en: "Menu", ro: "Meniu", hu: "Menü" },
  required: false,
  order: 80,
  menuLabel: { en: "Menu", ro: "Meniu", hu: "Menü" },
  variants: [
    { id: "courses", name: { en: "Courses", ro: "Feluri", hu: "Fogások" } },
  ],
  fields: [
    ...headingFields({
      eyebrow: { en: "At the table", ro: "La masă", hu: "Az asztalnál" },
      heading: {
        en: "A menu for lingering",
        ro: "Un meniu fără grabă",
        hu: "Egy menü, amivel nem sietünk",
      },
      note: {
        en: "A family-style Tuscan dinner, made with the season and meant to be shared.",
        ro: "O cină toscană în familie, gătită cu ce aduce sezonul și făcută pentru a fi împărțită.",
        hu: "Családias toszkán vacsora az évszak ízeiből, közös tálakból.",
      },
    }),
    {
      id: "courses",
      label: { en: "courses", ro: "feluri", hu: "fogások" },
      type: "list",
      maxItems: 4,
      item: [
        {
          id: "label",
          label: { en: "course", ro: "fel", hu: "fogás" },
          type: "text",
          maxLength: 30,
        },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
      ],
      fallback: [
        {
          label: { en: "To begin", ro: "La început", hu: "Kezdésnek" },
          title: {
            en: "Garden antipasti",
            ro: "Antipasti din grădină",
            hu: "Kerti antipasti",
          },
          note: {
            en: "Little seasonal bites from the garden",
            ro: "Gustări mici de sezon, din grădină",
            hu: "Apró szezonális falatok a kertből",
          },
        },
        {
          label: "Primo",
          title: {
            en: "Fresh pasta",
            ro: "Paste proaspete",
            hu: "Friss tészta",
          },
          note: {
            en: "Handmade, and passed around the table",
            ro: "Făcute în casă și date din mână în mână",
            hu: "Házi készítésű, kézről kézre adva",
          },
        },
        {
          label: "Secondo",
          title: {
            en: "A slow-cooked main",
            ro: "Un fel principal gătit încet",
            hu: "Lassan főtt főétel",
          },
          note: {
            en: "A Tuscan favorite, served family-style",
            ro: "Un preferat toscan, servit ca în familie",
            hu: "Toszkán kedvenc, családiasan tálalva",
          },
        },
        {
          label: { en: "To finish", ro: "La final", hu: "Végül" },
          title: {
            en: "Something sweet",
            ro: "Ceva dulce",
            hu: "Valami édes",
          },
          note: {
            en: "One more reason to linger a little longer",
            ro: "Încă un motiv să mai rămâi puțin",
            hu: "Még egy ok, hogy maradj egy kicsit",
          },
        },
      ],
    },
  ],
};
