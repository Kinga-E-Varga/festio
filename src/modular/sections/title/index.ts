import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** The hosts' names, large. The names are the event's; the lines around them the host's. */
export const section: SectionDefinition = {
  id: "title",
  name: { en: "Title", ro: "Titlu", hu: "Cím" },
  required: true,
  order: 20,
  variants: [{ id: "names", name: { en: "Names", ro: "Nume", hu: "Nevek" } }],
  fields: [
    {
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Together with our families",
        ro: "Împreună cu familiile noastre",
        hu: "Családjainkkal együtt",
      },
    },
    {
      id: "caption",
      label: {
        en: "line under the names",
        ro: "rândul de sub nume",
        hu: "sor a nevek alatt",
      },
      type: "text",
      maxLength: 120,
      fallback: {
        en: "invite you to celebrate the beginning of our forever",
        ro: "vă invită să fiți alături de ei la început de drum",
        hu: "meghívnak, hogy velük ünnepeld közös életük kezdetét",
      },
    },
  ],
};
