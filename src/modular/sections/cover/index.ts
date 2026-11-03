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
  variantGroups: [
    { id: "photo", name: { en: "Photo", ro: "Fotografie", hu: "Fotó" } },
    {
      id: "illustration",
      name: { en: "Illustration", ro: "Ilustrație", hu: "Illusztráció" },
    },
    { id: "card", name: { en: "Card", ro: "Card", hu: "Kártya" } },
  ],
  variants: [
    {
      id: "1",
      name: { en: "Box", ro: "Casetă", hu: "Doboz" },
      group: "photo",
      shows: ["photo", "kicker"],
    },
    {
      id: "2",
      name: { en: "Badge", ro: "Insignă", hu: "Jelvény" },
      group: "photo",
      shows: ["photo", "kicker"],
    },
    {
      id: "3",
      name: { en: "Champagne", ro: "Șampanie", hu: "Pezsgő" },
      group: "illustration",
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
    {
      id: "4",
      name: {
        en: "Birthday cake",
        ro: "Tort aniversar",
        hu: "Születésnapi torta",
      },
      group: "illustration",
      // The bunting and the floor run the whole width; on the page's surface,
      // so a pattern shows round the drawing.
      wide: true,
      // Drawn, no photo, a poster: the Title's lines on the band, but not its
      // eyebrow or caption, then the date and a free line on the ribbon.
      shows: ["details"],
      poster: [
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
      ],
    },
    {
      id: "5",
      name: { en: "Wildflower", ro: "Flori sălbatice", hu: "Vadvirág" },
      // A card on the page's ground, its corners drawn: with the Card covers.
      group: "card",
      // The corners and the border run the whole width; on the page's
      // surface, so a pattern shows round them.
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
    {
      id: "6",
      name: { en: "Stamp", ro: "Timbru", hu: "Bélyeg" },
      group: "card",
      // Not `wide`: the cover stops at the column, like the page's other
      // sections; the pattern under the page still shows round the card.
      // Drawn, no photo, a poster: the Title's lines but the caption, then
      // the date and a free line.
      shows: ["details", "drawing"],
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
    {
      id: "7",
      name: { en: "Playbill", ro: "Afiș", hu: "Plakát" },
      group: "card",
      // The highlight (`kicker`) as its big heading over the drawing; the
      // Title's second line isn't drawn here, so it stays the Title's.
      shows: ["kicker", "details", "drawing"],
      poster: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
      ],
    },
    {
      id: "8",
      name: { en: "Ticket", ro: "Bilet", hu: "Jegy" },
      // A whole drawn scene, not a card: with the illustrations.
      group: "illustration",
      // The pile of tickets and the change run the whole width, past the
      // column on a wide screen.
      wide: true,
      // Drawn, no photo, a poster: the Title's lines but the caption, the
      // details line along the main part's foot.
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
      // The Card covers' picture: a drawing from `src/modular/drawings/`.
      id: "drawing",
      label: { en: "illustration", ro: "ilustrație", hu: "illusztráció" },
      type: "drawing",
      maxLength: 60,
    },
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
      type: "longText",
      maxLength: 80,
    },
  ],
};
