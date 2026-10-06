import { HEADING_FIELDS } from "@/modular/heading";
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
  variants: [{ id: "1", name: { en: "Card", ro: "Card", hu: "Kártya" } }],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "title",
      label: LABELS.title,
      type: "text",
      maxLength: 80,
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 300,
    },
    {
      id: "showAccount",
      label: {
        en: "show account details",
        ro: "arată datele contului",
        hu: "számlaadatok mutatása",
      },
      type: "toggle",
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
    },
    {
      id: "iban",
      label: { en: "IBAN", ro: "IBAN", hu: "IBAN" },
      type: "text",
      maxLength: 42,
    },
    {
      id: "reference",
      label: { en: "reference", ro: "mențiune", hu: "közlemény" },
      type: "text",
      maxLength: 60,
    },
  ],
};
