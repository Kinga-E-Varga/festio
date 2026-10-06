import type { SectionDefinition } from "@/types/modular";

/**
 * Always on and always last. Its mark is the header's (`reads`), so the
 * host writes it once; the date comes from the event.
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
      name: { en: "Plain", ro: "Simplu", hu: "Egyszerű" },
    },
    {
      id: "2",
      name: { en: "Accent band", ro: "Bandă în accent", hu: "Kiemelő sáv" },
      ground: "accent",
    },
  ],
  fields: [
    {
      id: "backLabel",
      label: {
        en: "back-to-top link",
        ro: "linkul înapoi sus",
        hu: "vissza a tetejére link",
      },
      type: "text",
      maxLength: 40,
    },
  ],
};
