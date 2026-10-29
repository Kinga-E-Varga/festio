import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/**
 * How the hosts met: a longer text with one photo (not a gallery),
 * or a few dated moments.
 */
export const section: SectionDefinition = {
  id: "story",
  name: { en: "Our story", ro: "Povestea noastră", hu: "Történetünk" },
  required: false,
  order: 42,
  variants: [
    {
      id: "1",
      name: {
        en: "Two-line & photo",
        ro: "Două rânduri & fotografie",
        hu: "Kétsoros & fotó",
      },
      // No note: the story is the text under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "note"),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "4",
      name: {
        en: "Icon & photo",
        ro: "Pictogramă & fotografie",
        hu: "Ikon & fotó",
      },
      // No eyebrow, italic line or note.
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "note"),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "6",
      name: {
        en: "Full card & photo",
        ro: "Card întreg & fotografie",
        hu: "Teljes kártya & fotó",
      },
      // The eyebrow and heading only, over the photo and the story.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "5",
      name: {
        en: "Full card simple",
        ro: "Card întreg simplu",
        hu: "Teljes kártya egyszerű",
      },
      // Full card & photo without the photo: the eyebrow and heading over the story.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "story",
      ],
    },
    {
      id: "2",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      // The eyebrow and the heading only: the story is the text under them.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "story",
      ],
    },
    {
      id: "3",
      name: { en: "Moments", ro: "Momente", hu: "Pillanatok" },
      // Simple's heading, eyebrow and heading only, over Schedule's Timeline.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "moments.year",
        "moments.title",
        "moments.text",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "story",
      label: { en: "story", ro: "povestea", hu: "történet" },
      type: "longText",
      maxLength: 1200,
    },
    {
      id: "photo",
      label: LABELS.photo,
      type: "image",
      maxLength: 200,
      required: true,
    },
    {
      id: "photoAlt",
      label: {
        en: "photo description",
        ro: "descrierea fotografiei",
        hu: "a fotó leírása",
      },
      type: "text",
      maxLength: 150,
    },
    {
      id: "moments",
      label: { en: "moments", ro: "momente", hu: "pillanatok" },
      itemLabel: { en: "moment", ro: "momentul", hu: "pillanat" },
      addLabel: {
        en: "add new moment",
        ro: "adaugă un moment nou",
        hu: "új pillanat hozzáadása",
      },
      type: "list",
      maxItems: 6,
      item: [
        {
          id: "year",
          label: { en: "year", ro: "anul", hu: "év" },
          type: "text",
          maxLength: 12,
        },
        { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
        { id: "text", label: LABELS.text, type: "text", maxLength: 140 },
      ],
    },
  ],
};
