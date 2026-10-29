import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "faq",
  name: { en: "FAQ", ro: "Întrebări frecvente", hu: "GYIK" },
  required: false,
  order: 140,
  menuLabel: { en: "FAQ", ro: "Întrebări", hu: "GYIK" },
  variants: [
    {
      id: "1",
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [...HEADING_SHOWS, "linkLabel", "items.question", "items.answer"],
    },
    {
      id: "4",
      name: {
        en: "Two-line & bars",
        ro: "Două rânduri & bare",
        hu: "Kétsoros & sávok",
      },
      shows: [...HEADING_SHOWS, "linkLabel", "items.question", "items.answer"],
    },
    {
      id: "5",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      shows: ["heading", "note", "linkLabel", "items.question", "items.answer"],
    },
    {
      id: "2",
      name: {
        en: "Icon & bars",
        ro: "Pictogramă & bare",
        hu: "Ikon & sávok",
      },
      shows: ["heading", "note", "linkLabel", "items.question", "items.answer"],
    },
    {
      id: "3",
      name: { en: "Bars", ro: "Bare", hu: "Sávok" },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "linkLabel",
        "items.question",
        "items.answer",
      ],
    },
    {
      id: "6",
      name: {
        en: "Full card & list",
        ro: "Card întreg & listă",
        hu: "Teljes kártya & lista",
      },
      // Accommodation's Full card & list: no italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "linkLabel",
        "items.question",
        "items.answer",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "linkLabel",
      label: {
        en: "link to the reply form",
        ro: "linkul către formular",
        hu: "link a válaszűrlaphoz",
      },
      type: "text",
      maxLength: 60,
    },
    {
      id: "items",
      label: { en: "questions", ro: "întrebări", hu: "kérdések" },
      itemLabel: { en: "question", ro: "întrebarea", hu: "kérdés" },
      addLabel: {
        en: "add new question",
        ro: "adaugă o întrebare nouă",
        hu: "új kérdés hozzáadása",
      },
      type: "list",
      maxItems: 12,
      item: [
        {
          id: "question",
          label: { en: "question", ro: "întrebare", hu: "kérdés" },
          type: "text",
          maxLength: 120,
        },
        {
          id: "answer",
          label: { en: "answer", ro: "răspuns", hu: "válasz" },
          type: "longText",
          maxLength: 400,
        },
      ],
    },
  ],
};
