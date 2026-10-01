import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** Always on and always last. The form's own words are Festio's (`Rsvp`). */
export const section: SectionDefinition = {
  id: "rsvp",
  name: { en: "RSVP", ro: "Răspuns", hu: "Visszajelzés" },
  required: true,
  order: 150,
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Will you be there?",
        ro: "Vei fi alături de noi?",
        hu: "Ott leszel?",
      },
    },
  ],
};
