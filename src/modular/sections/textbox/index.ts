import type { SectionDefinition } from "@/types/modular";

/**
 * Extra text the other sections have no place for: a large line and a small
 * one under it. No heading: the words alone, unlike every other section.
 */
export const section: SectionDefinition = {
  id: "textbox",
  name: { en: "Text box", ro: "Casetă de text", hu: "Szövegdoboz" },
  required: false,
  order: 25,
  variants: [
    {
      id: "1",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "5",
      name: {
        en: "Simple joined",
        ro: "Simplu alăturat",
        hu: "Egyszerű csatolt",
      },
      // In the band of the section right before, whatever its colour.
      ground: "joined",
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "6",
      name: {
        en: "Sticker joined",
        ro: "Autocolant alăturat",
        hu: "Csatolt matrica",
      },
      // Simple joined, the large text as the title's stickers.
      ground: "joined",
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "2",
      name: {
        en: "Simple accent",
        ro: "Simplu accent",
        hu: "Egyszerű kiemelt",
      },
      ground: "own",
      band: "accent",
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "7",
      name: {
        en: "Quote accent",
        ro: "Citat accent",
        hu: "Kiemelt idézet",
      },
      // Simple accent with a large quote mark over the words.
      ground: "own",
      band: "accent",
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "8",
      name: { en: "Quote", ro: "Citat", hu: "Idézet" },
      // Quote accent on the page's surface.
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "9",
      name: {
        en: "Quote joined",
        ro: "Citat alăturat",
        hu: "Csatolt idézet",
      },
      // Quote in the band of the section right before, whatever its colour.
      ground: "joined",
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "3",
      name: { en: "Framed", ro: "Încadrat", hu: "Keretes" },
      shows: ["largeText", "italic", "smallText"],
    },
    {
      id: "4",
      name: {
        en: "Framed joined",
        ro: "Încadrat alăturat",
        hu: "Csatolt keretes",
      },
      // In the band of the section right before, whatever its colour.
      ground: "joined",
      shows: ["largeText", "italic", "smallText"],
    },
  ],
  fields: [
    {
      id: "largeText",
      label: { en: "large text", ro: "text mare", hu: "nagy szöveg" },
      type: "longText",
      maxLength: 300,
    },
    {
      id: "italic",
      label: { en: "italic", ro: "cursiv", hu: "dőlt" },
      type: "toggle",
    },
    {
      id: "smallText",
      label: { en: "small text", ro: "text mic", hu: "kis szöveg" },
      type: "text",
      maxLength: 80,
    },
  ],
};
