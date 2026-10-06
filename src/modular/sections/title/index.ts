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
      name: {
        en: "Colorful & divider",
        ro: "Colorat cu separator",
        hu: "Színes elválasztóval",
      },
    },
    {
      id: "2",
      name: { en: "Plain", ro: "Simplu", hu: "Egyszerű" },
    },
  ],
  fields: [
    {
      id: "namesStart",
      label: {
        en: "names, first part",
        ro: "nume, prima parte",
        hu: "nevek, első rész",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "namesMiddle",
      label: {
        en: "names, middle",
        ro: "nume, mijloc",
        hu: "nevek, középső rész",
      },
      type: "text",
      maxLength: 6,
    },
    {
      id: "namesEnd",
      label: {
        en: "names, last part",
        ro: "nume, ultima parte",
        hu: "nevek, utolsó rész",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
    },
    {
      id: "caption",
      label: {
        en: "line under the names",
        ro: "rândul de sub nume",
        hu: "sor a nevek alatt",
      },
      type: "text",
      maxLength: 120,
    },
  ],
};
