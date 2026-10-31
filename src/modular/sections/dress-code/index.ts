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
  "showSwatches",
  "swatchLabel",
  // Names are kept, but no longer asked for.
  "swatches.color",
];

/** Also drawn inside Helpful notes, from these same values. */
export const section: SectionDefinition = {
  id: "dress-code",
  name: { en: "Dress code", ro: "Ținută", hu: "Öltözet" },
  required: false,
  order: 100,
  menuLabel: GOOD_TO_KNOW,
  noteCard: ["eyebrow", "icon", ...CARD],
  variants: [
    {
      id: "1",
      name: { en: "Card", ro: "Card", hu: "Kártya" },
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
      // card's icon, its label, title and text; the colours under them.
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
      label: LABELS.text,
      type: "longText",
      maxLength: 300,
    },
    {
      id: "showSwatches",
      label: {
        en: "show colour swatches",
        ro: "arată mostrele de culoare",
        hu: "színminták mutatása",
      },
      type: "toggle",
      controls: ["swatchLabel", "swatches"],
    },
    {
      id: "swatchLabel",
      label: {
        en: "colours title",
        ro: "titlul culorilor",
        hu: "a színek címe",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "swatches",
      label: { en: "colours", ro: "culori", hu: "színek" },
      itemLabel: { en: "colour", ro: "culoarea", hu: "szín" },
      addLabel: {
        en: "add new colour",
        ro: "adaugă o culoare nouă",
        hu: "új szín hozzáadása",
      },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 20 },
        {
          id: "color",
          label: { en: "colour", ro: "culoare", hu: "szín" },
          type: "color",
          /* A hex colour, or one of the palette's roles ("secondary"). */
          maxLength: 9,
        },
      ],
    },
  ],
};
