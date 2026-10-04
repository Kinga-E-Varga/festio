import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { SAMPLE_PHOTO } from "@/modular/sample";
import type { SectionDefinition } from "@/types/modular";

/** The venue and its address are the event's; everything around them the host's. */
export const section: SectionDefinition = {
  id: "location",
  name: { en: "Location", ro: "Locația", hu: "Helyszín" },
  required: true,
  order: 50,
  variants: [
    {
      id: "venue-photo",
      name: {
        en: "Venue photo",
        ro: "Fotografia locației",
        hu: "Helyszínfotó",
      },
    },
  ],
  fields: [
    ...headingFields({
      eyebrow: {
        en: "A place we love",
        ro: "Un loc pe care îl iubim",
        hu: "Egy hely, amit szeretünk",
      },
      heading: {
        en: "Meet us in the hills",
        ro: "Ne vedem printre dealuri",
        hu: "Találkozzunk a dombok között",
      },
      note: {
        en: "A little countryside, a lot of heart, and room for one more at our table.",
        ro: "Puțină natură, multă inimă și loc pentru încă unul la masa noastră.",
        hu: "Egy kis vidék, sok szeretet, és még egy hely az asztalunknál.",
      },
    }),
    {
      id: "label",
      label: {
        en: "line above the venue",
        ro: "rândul de deasupra locației",
        hu: "sor a helyszín fölött",
      },
      type: "text",
      maxLength: 40,
      fallback: { en: "Celebration", ro: "Petrecere", hu: "Ünnepség" },
    },
    {
      id: "detail",
      label: {
        en: "line under the venue",
        ro: "rând sub locație",
        hu: "sor a helyszín alatt",
      },
      type: "text",
      maxLength: 80,
      fallback: {
        en: "Ceremony & dinner, all in one place",
        ro: "Ceremonia și cina, în același loc",
        hu: "Szertartás és vacsora, egy helyen",
      },
    },
    {
      id: "photo",
      label: LABELS.photo,
      type: "image",
      maxLength: 300,
      fallback: SAMPLE_PHOTO,
    },
  ],
};
