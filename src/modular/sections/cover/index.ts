import { LABELS } from "@/modular/labels";
import { SAMPLE_PHOTO } from "@/modular/sample";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "cover",
  name: { en: "Cover", ro: "Copertă", hu: "Borító" },
  required: true,
  order: 10,
  ground: "own",
  variants: [
    {
      id: "photo",
      name: { en: "Full photo", ro: "Fotografie întreagă", hu: "Teljes fotó" },
    },
  ],
  fields: [
    {
      id: "photo",
      label: LABELS.photo,
      type: "image",
      maxLength: 300,
      fallback: SAMPLE_PHOTO,
    },
    {
      id: "kicker",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "A weekend in Tuscany",
        ro: "Un weekend în Toscana",
        hu: "Egy hétvége Toszkánában",
      },
    },
    {
      id: "dateLine",
      label: { en: "date line", ro: "rândul cu data", hu: "dátumsor" },
      type: "text",
      maxLength: 60,
      // Empty: the event's date. A host can write a range ("17 — 19 September").
      fallback: "",
    },
    {
      id: "scrollLabel",
      label: {
        en: "scroll-down link",
        ro: "linkul de derulare",
        hu: "görgetés link",
      },
      type: "text",
      maxLength: 40,
      fallback: {
        en: "Scroll for details",
        ro: "Derulează pentru detalii",
        hu: "Görgess a részletekért",
      },
    },
  ],
};
