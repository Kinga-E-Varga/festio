import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "playlist",
  name: { en: "Playlist", ro: "Playlist", hu: "Lejátszási lista" },
  required: false,
  order: 145,
  ground: "own",
  variants: [
    {
      id: "1",
      name: { en: "Record", ro: "Vinil", hu: "Bakelit" },
      // No intro line and no italic second line: the heading and its note only.
      shows: HEADING_SHOWS.filter(
        (id) => id !== "eyebrow" && id !== "headingItalic",
      ),
    },
  ],
  fields: [...HEADING_FIELDS],
};
