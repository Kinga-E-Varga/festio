import { HEADING_FIELDS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/**
 * Always on; only the footer comes after it. The form's own words are
 * Festio's (`Rsvp`); everything around it is the host's, including when to
 * reply by.
 */
export const section: SectionDefinition = {
  id: "rsvp",
  name: { en: "Reply form", ro: "Formular de răspuns", hu: "Válaszűrlap" },
  required: true,
  order: 150,
  ground: "own",
  variants: [
    {
      id: "1",
      name: { en: "Soft band", ro: "Bandă discretă", hu: "Lágy sáv" },
    },
    {
      id: "2",
      name: { en: "Bold band", ro: "Bandă intensă", hu: "Élénk sáv" },
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "thankYou",
      label: {
        en: "line above the thank-you heading",
        ro: "rândul de deasupra titlului de mulțumire",
        hu: "sor a köszönő címsor fölött",
      },
      type: "text",
      maxLength: 30,
    },
    {
      id: "thanks",
      label: {
        en: "thank-you heading",
        ro: "titlul de mulțumire",
        hu: "köszönő címsor",
      },
      type: "text",
      maxLength: 60,
    },
  ],
};
