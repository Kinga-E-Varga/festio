import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/** No intro line and no italic second line: the heading and its note only. */
const SHOWS = HEADING_SHOWS.filter(
  (id) => id !== "eyebrow" && id !== "headingItalic",
);

export const section: SectionDefinition = {
  id: "playlist",
  name: { en: "Playlist", ro: "Playlist", hu: "Lejátszási lista" },
  required: false,
  order: 145,
  variants: [
    {
      id: "1",
      name: { en: "Accent", ro: "Accent", hu: "Kiemelt" },
      ground: "own",
      band: "accent",
      shows: SHOWS,
    },
    {
      id: "2",
      name: {
        en: "Simple",
        ro: "Simplu",
        hu: "Egyszerű",
      },
      // Record (`1`) on the page's surface.
      shows: SHOWS,
    },
    {
      id: "3",
      name: {
        en: "Card",
        ro: "Card",
        hu: "Kártya",
      },
      // Record on the page (`2`), its words centred in a full card, the record lying over its left side.
      shows: SHOWS,
    },
  ],
  fields: [...HEADING_FIELDS],
};
