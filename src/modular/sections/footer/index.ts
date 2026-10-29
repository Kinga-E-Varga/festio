import type { SectionDefinition } from "@/types/modular";

/**
 * Always on and always last. Its mark is the header's (`reads`), so the
 * host writes it once; the date comes from the event and the way back up
 * is Festio's own words. Nothing of its own to edit, so no Content.
 */
export const section: SectionDefinition = {
  id: "footer",
  name: { en: "Footer", ro: "Subsol", hu: "Lábléc" },
  required: true,
  order: 160,
  ground: "own",
  reads: ["header"],
  variants: [
    {
      id: "1",
      name: { en: "Colourful", ro: "Colorat", hu: "Színes" },
      // A band of the surface, so the page's pattern stays off it, as Plain.
      band: "surface",
      shows: [],
    },
    {
      id: "2",
      name: { en: "Accent", ro: "Accent", hu: "Kiemelt" },
      ground: "accent",
      shows: [],
    },
    {
      id: "3",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      // Accent's footer on the page's surface, in its ink: a band of the
      // surface, so the page's pattern stays off it.
      band: "surface",
      shows: [],
    },
  ],
  fields: [],
};
