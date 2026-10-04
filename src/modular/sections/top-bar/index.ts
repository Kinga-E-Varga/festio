import type { SectionDefinition } from "@/types/modular";

/**
 * Always on and always first. Drawn straight in the page's column, not
 * wrapped like the other sections, so it stays stuck to the top the whole
 * way down. No menu label: it is the menu.
 *
 * Every variant is 56px tall, 64px from `@5xl` (`h-14 @5xl:h-16`): the
 * sections' `scroll-margin` and the page's loading bar assume it. The
 * footer reads its `mark`.
 */
export const section: SectionDefinition = {
  id: "top-bar",
  name: { en: "Top bar", ro: "Bara de sus", hu: "Felső sáv" },
  required: true,
  order: 0,
  variants: [
    {
      id: "monogram",
      name: { en: "Monogram", ro: "Monogramă", hu: "Monogram" },
    },
  ],
  fields: [
    {
      id: "mark",
      label: { en: "mark", ro: "semn", hu: "jel" },
      type: "text",
      maxLength: 24,
      // Empty: the hosts' initials ("M & L").
      fallback: "",
    },
  ],
};
