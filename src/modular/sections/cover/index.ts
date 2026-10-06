import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "cover",
  name: { en: "Cover", ro: "Copertă", hu: "Borító" },
  required: true,
  order: 10,
  ground: "own",
  variants: [
    {
      id: "1",
      name: { en: "Box", ro: "Casetă", hu: "Doboz" },
    },
    {
      id: "2",
      name: { en: "Badge", ro: "Insignă", hu: "Jelvény" },
    },
  ],
  fields: [
    {
      id: "photo",
      label: LABELS.photo,
      type: "image",
      maxLength: 300,
    },
    {
      id: "kicker",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
    },
    {
      id: "dateLine",
      label: { en: "date line", ro: "rândul cu data", hu: "dátumsor" },
      type: "text",
      maxLength: 60,
    },
  ],
};
