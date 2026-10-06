import { HEADING_FIELDS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "faq",
  name: { en: "FAQ", ro: "Întrebări frecvente", hu: "GYIK" },
  required: false,
  order: 140,
  menuLabel: { en: "FAQ", ro: "Întrebări", hu: "GYIK" },
  variants: [
    {
      id: "1",
      name: { en: "Simple list", ro: "Listă simplă", hu: "Egyszerű lista" },
    },
    {
      id: "2",
      name: {
        en: "Icon & bars",
        ro: "Pictogramă și bare",
        hu: "Ikon és sávok",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "linkLabel",
      label: {
        en: "link to the reply form",
        ro: "linkul către formular",
        hu: "link a válaszűrlaphoz",
      },
      type: "text",
      maxLength: 60,
    },
    {
      id: "items",
      label: { en: "questions", ro: "întrebări", hu: "kérdések" },
      type: "list",
      maxItems: 12,
      item: [
        {
          id: "question",
          label: { en: "question", ro: "întrebare", hu: "kérdés" },
          type: "text",
          maxLength: 120,
        },
        {
          id: "answer",
          label: { en: "answer", ro: "răspuns", hu: "válasz" },
          type: "longText",
          maxLength: 400,
        },
      ],
    },
  ],
};
