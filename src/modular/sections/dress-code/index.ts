import { LABELS } from "@/modular/labels";
import type { ItemField, SectionDefinition } from "@/types/modular";

const ITEM: ItemField[] = [
  { id: "text", label: LABELS.text, type: "text", maxLength: 40 },
];

export const section: SectionDefinition = {
  id: "dress-code",
  name: { en: "Dress code", ro: "Ținută", hu: "Öltözet" },
  required: false,
  order: 80,
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 40,
      fallback: {
        en: "Garden formal",
        ro: "Elegant de grădină",
        hu: "Elegáns kerti",
      },
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 240,
      fallback: {
        en: "The ceremony is on grass and evenings cool down.",
        ro: "Ceremonia e pe iarbă, iar serile se răcoresc.",
        hu: "A szertartás füvön lesz, és az esték hűvösek.",
      },
    },
    {
      id: "wear",
      label: { en: "yes, please", ro: "da, te rugăm", hu: "igen, kérjük" },
      type: "list",
      maxItems: 6,
      item: ITEM,
      fallback: [
        {
          text: {
            en: "Block heels",
            ro: "Tocuri groase",
            hu: "Vastag sarkú cipő",
          },
        },
        {
          text: {
            en: "A light layer",
            ro: "Un strat subțire în plus",
            hu: "Egy könnyű réteg",
          },
        },
        {
          text: {
            en: "Soft colours",
            ro: "Culori delicate",
            hu: "Lágy színek",
          },
        },
      ],
    },
    {
      id: "skip",
      label: { en: "best skipped", ro: "mai bine nu", hu: "inkább ne" },
      type: "list",
      maxItems: 6,
      item: ITEM,
      fallback: [
        { text: { en: "Stilettos", ro: "Tocuri stiletto", hu: "Tűsarok" } },
        { text: { en: "All white", ro: "Complet alb", hu: "Csupa fehér" } },
      ],
    },
    {
      id: "swatches",
      label: { en: "colours", ro: "culori", hu: "színek" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 20 },
        {
          id: "color",
          label: { en: "colour", ro: "culoare", hu: "szín" },
          type: "text",
          maxLength: 7,
        },
      ],
      fallback: [
        { name: { en: "Sage", ro: "Salvie", hu: "Zsálya" }, color: "#7E9277" },
        {
          name: { en: "Apricot", ro: "Caisă", hu: "Barack" },
          color: "#E4A372",
        },
        { name: { en: "Wheat", ro: "Grâu", hu: "Búza" }, color: "#DBCDA1" },
        { name: { en: "Mist", ro: "Ceață", hu: "Pára" }, color: "#ADCCD4" },
      ],
    },
  ],
};
