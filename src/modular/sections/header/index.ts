import type { SectionDefinition } from "@/types/modular";

/**
 * Always on and always first. Drawn straight in the page's column, not
 * wrapped like the other sections, so it stays stuck to the top the whole
 * way down. No menu label: it is the menu.
 *
 * Every variant is 56px tall, 64px from `@5xl` (`h-14 @5xl:h-16`): the
 * sections' `scroll-margin` and the page's loading bar assume it. The
 * footer reads its mark (`markStart`, `markMiddle`, `markEnd`).
 */
export const section: SectionDefinition = {
  id: "header",
  name: { en: "Header", ro: "Antet", hu: "Fejléc" },
  required: true,
  order: 0,
  variants: [
    {
      id: "1",
      name: { en: "Colourful", ro: "Colorat", hu: "Színes" },
      shows: ["markStart", "markMiddle", "markEnd"],
    },
    {
      id: "2",
      name: { en: "Balanced", ro: "Echilibrat", hu: "Kiegyensúlyozott" },
      shows: ["markStart", "markMiddle", "markEnd"],
    },
    {
      id: "3",
      name: { en: "Plain", ro: "Simplu", hu: "Egyszerű" },
      shows: ["markStart", "markMiddle", "markEnd"],
    },
  ],
  fields: [
    {
      id: "markStart",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 12,
    },
    {
      id: "markMiddle",
      label: {
        en: "mark",
        ro: "semn",
        hu: "jel",
      },
      type: "text",
      maxLength: 12,
    },
    {
      id: "markEnd",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 12,
    },
  ],
};
