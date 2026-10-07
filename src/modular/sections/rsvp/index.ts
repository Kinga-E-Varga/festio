import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
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
      shows: [...HEADING_SHOWS],
    },
    {
      id: "2",
      name: { en: "Bold band", ro: "Bandă intensă", hu: "Élénk sáv" },
      // No italic second line under the heading.
      shows: ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    /*
     * The thank-you texts: drawn by both variants from the samples, but in
     * no variant's `shows`, so the Content tab does not offer them yet.
     */
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
