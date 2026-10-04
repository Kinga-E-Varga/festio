import { headingFields } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "playlist",
  name: { en: "Playlist", ro: "Playlist", hu: "Lejátszási lista" },
  required: false,
  order: 145,
  ground: "own",
  variants: [
    { id: "record", name: { en: "Record", ro: "Vinil", hu: "Bakelit" } },
  ],
  fields: [
    ...headingFields({
      heading: {
        en: "Which song gets you off your chair?",
        ro: "Ce melodie te ridică de pe scaun?",
        hu: "Melyik dal ugraszt fel a székből?",
      },
      note: {
        en: "Add your song to your reply and we’ll hand the list to the band.",
        ro: "Scrie melodia ta în răspuns și dăm lista formației.",
        hu: "Írd meg a dalodat a válaszodban, és továbbadjuk a listát a zenekarnak.",
      },
    }),
  ],
};
