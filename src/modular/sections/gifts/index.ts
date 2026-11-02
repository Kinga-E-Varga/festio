import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
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
  noteCard: ["eyebrow", "icon", ...CARD],
  variants: [
    {
      id: "1",
      name: { en: "Wide card", ro: "Card lat", hu: "Széles kártya" },
      // Every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "icon",
        ...CARD,
      ],
    },
    {
      id: "3",
      name: {
        en: "Two-line & card",
        ro: "Două rânduri & card",
        hu: "Kétsoros & kártya",
      },
      shows: [...HEADING_SHOWS, ...CARD],
    },
    {
      id: "2",
      name: {
        en: "Icon & card",
        ro: "Pictogramă & card",
        hu: "Ikon & kártya",
      },
      shows: [...ICON_HEADING_SHOWS, "icon", ...CARD],
    },
    {
      id: "4",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // The heading but its italic line, then the card's own fields.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "icon",
        ...CARD,
      ],
    },
    {
      id: "5",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Full card on the accent; always on the page's surface, whatever its turn.
      ground: "surface",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "icon",
        ...CARD,
      ],
    },
    {
      id: "6",
      name: { en: "Accent", ro: "Accent", hu: "Kiemelt" },
      // On the accent band: the heading but its italic line, then the
      // card's icon, its label, title and text; the gift buttons under them.
      ground: "accent",
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "icon",
        "label",
        ...CARD,
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
    // The card's own small line over its title, apart from the heading's intro line.
    { id: "label", label: LABELS.label, type: "text", maxLength: 30 },
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
