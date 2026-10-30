import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "cover",
  name: { en: "Cover", ro: "Copertă", hu: "Borító" },
  required: true,
  order: 10,
  ground: "own",
  // A poster cover draws the Title's lines.
  reads: ["title"],
  variants: [
    {
      id: "1",
      name: { en: "Box", ro: "Casetă", hu: "Doboz" },
      shows: ["photo", "kicker"],
    },
    {
      id: "2",
      name: { en: "Badge", ro: "Insignă", hu: "Jelvény" },
      shows: ["photo", "kicker"],
    },
    {
      id: "3",
      name: { en: "Champagne", ro: "Șampanie", hu: "Pezsgő" },
      // The accent edge to edge, past the column too.
      band: "accent",
      // The stars fill the whole width too; the glass and words stay in the column.
      wide: true,
      // Drawn, no photo, a poster: the Title's lines but the caption, then
      // the date and a free line.
      shows: ["details"],
      poster: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
      ],
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
      label: { en: "highlight", ro: "evidențiere", hu: "kiemelés" },
      type: "text",
      maxLength: 60,
    },
    {
      id: "details",
      label: {
        en: "details line",
        ro: "rând cu detalii",
        hu: "részletek sora",
      },
      type: "text",
      maxLength: 80,
    },
  ],
};
