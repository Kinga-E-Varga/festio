import { HEADING_FIELDS } from "@/modular/heading";
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
    },
  ],
  fields: [...HEADING_FIELDS],
};
