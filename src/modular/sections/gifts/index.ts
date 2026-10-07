import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/** What the card draws, here and inside Helpful notes. */
const CARD = [
  "title",
  "body",
  "showAccount",
  "holder",
  "iban",
  "reference",
  "showRegistry",
  "registryLink",
];

/** Also drawn inside Helpful notes, from these same values. */
export const section: SectionDefinition = {
  id: "gifts",
  name: { en: "Gift preferences", ro: "Cadouri", hu: "Ajándékok" },
  required: false,
  order: 110,
  menuLabel: GOOD_TO_KNOW,
  noteCard: CARD,
  variants: [
    {
      id: "1",
      name: { en: "Card", ro: "Card", hu: "Kártya" },
      // The heading's intro line and heading only: no italic line, no note.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        ...CARD,
      ],
    },
  ],
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
      label: LABELS.note,
      type: "longText",
      maxLength: 300,
    },
    {
      id: "showAccount",
      label: {
        en: "add account details",
        ro: "adaugă datele contului",
        hu: "számlaadatok hozzáadása",
      },
      type: "toggle",
      controls: ["holder", "iban", "reference"],
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
    {
      id: "showRegistry",
      label: {
        en: "add registry",
        ro: "adaugă lista de cadouri",
        hu: "ajándéklista hozzáadása",
      },
      type: "toggle",
      controls: ["registryLink"],
    },
    {
      id: "registryLink",
      label: {
        en: "registry link",
        ro: "linkul listei de cadouri",
        hu: "az ajándéklista linkje",
      },
      type: "text",
      maxLength: 300,
    },
  ],
};
