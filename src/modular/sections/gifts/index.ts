import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "gifts",
  name: { en: "Gift preferences", ro: "Cadouri", hu: "Ajándékok" },
  required: false,
  order: 100,
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Your presence is the gift",
        ro: "Prezența ta e darul",
        hu: "A jelenléted a legszebb ajándék",
      },
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 240,
      fallback: {
        en: "If you would still like to give something, we are putting it towards the house.",
        ro: "Dacă totuși vrei să ne dăruiești ceva, îl punem deoparte pentru casă.",
        hu: "Ha mégis szeretnél valamit adni, azt a házra tesszük félre.",
      },
    },
    {
      id: "holder",
      label: {
        en: "account holder",
        ro: "titular cont",
        hu: "számlatulajdonos",
      },
      type: "text",
      maxLength: 60,
      fallback: "Maria Ionescu",
    },
    {
      id: "iban",
      label: { en: "IBAN", ro: "IBAN", hu: "IBAN" },
      type: "text",
      maxLength: 42,
      fallback: "RO49 AAAA 1B31 0075 9384 0000",
    },
    {
      id: "reference",
      label: { en: "reference", ro: "mențiune", hu: "közlemény" },
      type: "text",
      maxLength: 60,
      fallback: "Maria & Andrei",
    },
  ],
};
