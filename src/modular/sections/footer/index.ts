import type { SectionDefinition } from "@/types/modular";

/**
 * Always on and always last. Its mark is the top bar's (`reads`), so the
 * host writes it once; the date comes from the event.
 */
export const section: SectionDefinition = {
  id: "footer",
  name: { en: "Footer", ro: "Subsol", hu: "Lábléc" },
  required: true,
  order: 160,
  ground: "own",
  reads: ["top-bar"],
  variants: [
    {
      id: "monogram",
      name: { en: "Monogram", ro: "Monogramă", hu: "Monogram" },
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
      fallback: {
        en: "Back to the beginning",
        ro: "Înapoi la început",
        hu: "Vissza az elejére",
      },
    },
  ],
};
