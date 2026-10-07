import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
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
