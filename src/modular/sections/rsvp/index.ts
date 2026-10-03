import { headingFields } from "@/modular/heading";
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
  fields: [
    ...headingFields({
      eyebrow: {
        en: "A little note back",
        ro: "Un mic răspuns",
        hu: "Egy kis visszajelzés",
      },
      heading: {
        en: "Will you join us?",
        ro: "Ne veți fi alături?",
        hu: "Velünk tartasz?",
      },
      note: {
        en: "Save your seat at our table. Kindly reply by 1 August 2027.",
        ro: "Păstrează-ți locul la masa noastră. Te rugăm să răspunzi până pe 1 august 2027.",
        hu: "Foglald le a helyed az asztalunknál. Kérjük, 2027. augusztus 1-ig válaszolj.",
      },
    }),
    {
      id: "thankYou",
      label: {
        en: "line above the thank-you heading",
        ro: "rândul de deasupra titlului de mulțumire",
        hu: "sor a köszönő címsor fölött",
      },
      type: "text",
      maxLength: 30,
      fallback: { en: "Thank you", ro: "Mulțumim", hu: "Köszönjük" },
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
      fallback: {
        en: "Your reply is with us.",
        ro: "Am primit răspunsul tău.",
        hu: "Megkaptuk a válaszod.",
      },
    },
  ],
};
