import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "playlist",
  name: { en: "Playlist", ro: "Playlist", hu: "Lejátszási lista" },
  required: false,
  order: 110,
  fields: [
    {
      id: "kicker",
      label: LABELS.kicker,
      type: "text",
      maxLength: 40,
      fallback: {
        en: "On the dance floor",
        ro: "Pe ringul de dans",
        hu: "A táncparketten",
      },
    },
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 80,
      fallback: {
        en: "Which song gets you off your chair?",
        ro: "Ce melodie te ridică de pe scaun?",
        hu: "Melyik dal ugraszt fel a székből?",
      },
    },
    {
      id: "body",
      label: LABELS.text,
      type: "longText",
      maxLength: 200,
      fallback: {
        en: "Tell us when you see us and we will hand the list to the band.",
        ro: "Spune-ne când ne vedem și dăm lista formației.",
        hu: "Mondd el, ha találkozunk, és továbbadjuk a listát a zenekarnak.",
      },
    },
  ],
};
