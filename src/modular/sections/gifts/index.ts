import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/** Also drawn inside Helpful notes, from these same values. */
export const section: SectionDefinition = {
  id: "gifts",
  name: { en: "Gift preferences", ro: "Cadouri", hu: "Ajándékok" },
  required: false,
  order: 110,
  menuLabel: GOOD_TO_KNOW,
  fields: [
    ...headingFields({
      eyebrow: {
        en: "With gratitude",
        ro: "Cu recunoștință",
        hu: "Hálával",
      },
      heading: {
        en: "A note on gifts",
        ro: "Despre cadouri",
        hu: "Az ajándékokról",
      },
    }),
    {
      id: "title",
      label: LABELS.title,
      type: "text",
      maxLength: 80,
      fallback: {
        en: "Your presence is our present",
        ro: "Prezența ta e cel mai frumos dar",
        hu: "A jelenléted a legszebb ajándék",
      },
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 300,
      fallback: {
        en: "Truly. If you’d like to give something, a contribution to our honeymoon fund would mean the world.",
        ro: "Chiar așa. Dacă vrei totuși să ne dăruiești ceva, o contribuție pentru luna de miere ne-ar bucura enorm.",
        hu: "Tényleg. Ha mégis adnál valamit, a nászutunkhoz való hozzájárulás nagyon sokat jelentene.",
      },
    },
    {
      id: "showAccount",
      label: {
        en: "show account details",
        ro: "arată datele contului",
        hu: "számlaadatok mutatása",
      },
      type: "toggle",
      fallback: true,
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
      fallback: "Mara Rossi",
    },
    {
      id: "iban",
      label: { en: "IBAN", ro: "IBAN", hu: "IBAN" },
      type: "text",
      maxLength: 42,
      fallback: "IT60 X054 2811 1010 0000 0123 456",
    },
    {
      id: "reference",
      label: { en: "reference", ro: "mențiune", hu: "közlemény" },
      type: "text",
      maxLength: 60,
      fallback: "Mara & Luca",
    },
  ],
};
