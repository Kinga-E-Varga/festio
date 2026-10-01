import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "cover",
  name: { en: "Cover", ro: "Copertă", hu: "Borító" },
  required: true,
  order: 10,
  fields: [
    {
      id: "kicker",
      label: LABELS.kicker,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "We are getting married",
        ro: "Ne căsătorim",
        hu: "Összeházasodunk",
      },
    },
  ],
};
