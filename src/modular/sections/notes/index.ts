import { HEADING_FIELDS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW, MAX_NOTES, NOTE_SWITCH } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/**
 * Up to six numbered subsections. Dress code and Gifts are the standalone
 * sections' own values (`reads`), written once; a Custom one is the host's
 * own title, text and icon. `kind` is one of `NOTE_KINDS`.
 */
export const section: SectionDefinition = {
  id: "notes",
  name: {
    en: "Helpful notes",
    ro: "Informații utile",
    hu: "Hasznos tudnivalók",
  },
  required: false,
  order: 90,
  menuLabel: GOOD_TO_KNOW,
  reads: ["dress-code", "gifts"],
  variants: [
    {
      id: "1",
      name: {
        en: "Cards with icons",
        ro: "Carduri cu pictograme",
        hu: "Kártyák ikonokkal",
      },
    },
    // "2" is retired (Simple, removed): never reuse it.
    {
      id: "3",
      name: {
        en: "Icon & list",
        ro: "Pictogramă și listă",
        hu: "Ikon és lista",
      },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: NOTE_SWITCH["dress-code"],
      label: { en: "dress code", ro: "ținută", hu: "dresszkód" },
      type: "toggle",
    },
    {
      id: NOTE_SWITCH.gifts,
      label: { en: "gifts", ro: "cadouri", hu: "ajándékok" },
      type: "toggle",
    },
    {
      id: NOTE_SWITCH.custom,
      label: {
        en: "your own notes",
        ro: "notițele tale",
        hu: "saját tudnivalók",
      },
      type: "toggle",
    },
    {
      id: "items",
      label: { en: "notes", ro: "informații", hu: "tudnivalók" },
      type: "list",
      maxItems: MAX_NOTES,
      item: [
        {
          id: "kind",
          label: { en: "kind", ro: "tip", hu: "típus" },
          type: "text",
          maxLength: 20,
        },
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 30 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.text, type: "longText", maxLength: 300 },
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
      ],
    },
  ],
};
