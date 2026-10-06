import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/** Also drawn inside Helpful notes, from these same values. */
export const section: SectionDefinition = {
  id: "dress-code",
  name: { en: "Dress code", ro: "Ținută", hu: "Öltözet" },
  required: false,
  order: 100,
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
      id: "swatchLabel",
      label: {
        en: "line above the colours",
        ro: "rândul de deasupra culorilor",
        hu: "sor a színek fölött",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "swatches",
      label: { en: "colours", ro: "culori", hu: "színek" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 20 },
        {
          id: "color",
          label: { en: "colour", ro: "culoare", hu: "szín" },
          type: "text",
          /* A hex colour, or one of the palette's roles ("secondary"). */
          maxLength: 9,
        },
      ],
    },
  ],
};
