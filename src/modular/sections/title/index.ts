import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** The names, large, in three parts like the header's mark, between two lines. */
export const section: SectionDefinition = {
  id: "title",
  name: { en: "Title", ro: "Titlu", hu: "Cím" },
  required: true,
  order: 20,
  variants: [
    {
      id: "1",
      name: { en: "Colorful", ro: "Colorat", hu: "Színes" },
      shows: [
        "decoration",
        "eyebrow",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "caption",
      ],
    },
    {
      id: "2",
      name: { en: "Plain", ro: "Simplu", hu: "Egyszerű" },
      shows: [
        "decoration",
        "eyebrow",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "secondLine",
        "caption",
      ],
    },
  ],
  fields: [
    {
      id: "decoration",
      label: { en: "decoration", ro: "decor", hu: "díszítés" },
      type: "choice",
      options: [
        { id: "none", label: { en: "None", ro: "Niciunul", hu: "Nincs" } },
        {
          id: "diamonds",
          label: { en: "Diamonds", ro: "Romburi", hu: "Rombuszok" },
        },
      ],
    },
    {
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
    },
    {
      id: "namesStart",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "namesMiddle",
      label: {
        en: "mark",
        ro: "semn",
        hu: "jel",
      },
      type: "text",
      maxLength: 12,
    },
    {
      id: "namesEnd",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "secondLine",
      label: { en: "title line", ro: "rând de titlu", hu: "címsor" },
      type: "text",
      maxLength: 40,
    },
    {
      id: "caption",
      label: { en: "subtitle", ro: "subtitlu", hu: "alcím" },
      type: "text",
      maxLength: 120,
    },
  ],
};
