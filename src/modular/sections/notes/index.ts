import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import { GOOD_TO_KNOW, MAX_NOTES } from "@/modular/notes";
import type { SectionDefinition } from "@/types/modular";

/**
 * Up to four numbered subsections. Dress code and Gifts are the standalone
 * sections' own values (`reads`), written once; a Custom one is the host's
 * own title, text and icon. `kind` is one of `NOTE_KINDS`.
 */
export const section: SectionDefinition = {
  id: "notes",
  name: {
    en: "Helpful notes",
    ro: "Informații utile",
    hu: "Hasznos tudnivalók",
  },
  required: false,
  order: 90,
  menuLabel: GOOD_TO_KNOW,
  reads: ["dress-code", "gifts"],
  fields: [
    ...headingFields({
      eyebrow: {
        en: "The little things",
        ro: "Lucrurile mărunte",
        hu: "Az apróságok",
      },
      heading: {
        en: "A few helpful notes",
        ro: "Câteva informații utile",
        hu: "Néhány hasznos tudnivaló",
      },
      note: {
        en: "The details that make a lovely weekend feel effortless.",
        ro: "Detaliile care fac un weekend frumos să pară ușor.",
        hu: "A részletek, amelyektől egy szép hétvége könnyednek érződik.",
      },
    }),
    {
      id: "items",
      label: { en: "notes", ro: "informații", hu: "tudnivalók" },
      type: "list",
      maxItems: MAX_NOTES,
      item: [
        {
          id: "kind",
          label: { en: "kind", ro: "tip", hu: "típus" },
          type: "text",
          maxLength: 20,
        },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.text, type: "longText", maxLength: 300 },
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
      ],
      fallback: [
        { kind: "dress-code", title: "", text: "", icon: "" },
        { kind: "gifts", title: "", text: "", icon: "" },
        {
          kind: "custom",
          title: { en: "Little ones", ro: "Cei mici", hu: "A legkisebbek" },
          text: {
            en: "Children are very welcome. There’s a quiet room with games, and a sitter from nine in the evening.",
            ro: "Copiii sunt bineveniți. Avem o cameră liniștită cu jocuri și o bonă de la ora nouă seara.",
            hu: "A gyerekeket szeretettel várjuk. Lesz egy csendes szoba játékokkal, este kilenctől pedig bébiszitter.",
          },
          icon: "heart",
        },
      ],
    },
  ],
};
