import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "cover",
  name: { en: "Cover", ro: "Copertă", hu: "Borító" },
  required: true,
  order: 10,
  ground: "own",
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
      id: "10",
      name: { en: "Date block", ro: "Bloc cu data", hu: "Dátumblokk" },
      group: "photo",
      // The whole screen: the page's width, past the column, and from under
      // the frosted bar.
      wide: true,
      underHeader: true,
      // The date as big digits on a block in the secondary, the photo over
      // it, then the names and their second line, and a free line.
      shows: [
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "photo",
        "details",
      ],
      // The section after it starts on the second surface.
      nextGround: "surface-alt",
    },
    {
      id: "11",
      name: { en: "Centred", ro: "Centrat", hu: "Középen" },
      group: "photo",
      // The whole screen: the page's width, past the column, and from under
      // the frosted bar.
      wide: true,
      underHeader: true,
      // The photo fills the cover, and centred in its top 65% the names and
      // their second line, the date, a divider and a free line, all in one
      // dark colour, for a photo light there.
      shows: [
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "photo",
        "details",
      ],
    },
    {
      id: "3",
      name: { en: "Champagne", ro: "Șampanie", hu: "Pezsgő" },
      group: "illustration",
      // The accent edge to edge, past the column too.
      band: "accent",
      // The stars fill the whole width too; the glass and words stay in the column.
      wide: true,
      // Drawn, no photo: the small line, the names and their line, then
      // the date and a free line.
      // Drawn right up to the page's top, under the frosted bar.
      underHeader: true,
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "details",
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
      // Drawn, no photo: the names and their line on the band, then the
      // date and a free line on the ribbon.
      // Drawn right up to the page's top, under the frosted bar.
      underHeader: true,
      shows: [
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "details",
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
      // Drawn, no photo: the small line, the names and their line, then
      // the date and a free line.
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "details",
      ],
    },
    {
      id: "6",
      name: { en: "Stamp", ro: "Timbru", hu: "Bélyeg" },
      group: "card",
      // Not `wide`: the cover stops at the column, like the page's other
      // sections; the pattern under the page still shows round the card.
      // Drawn, no photo: the small line, the names and their line, then
      // the date and a free line.
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "details",
        "drawing",
      ],
    },
    {
      id: "7",
      name: { en: "Playbill", ro: "Afiș", hu: "Plakát" },
      group: "card",
      // The highlight (`kicker`) as its big heading over the drawing; no
      // second line under the names.
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "kicker",
        "details",
        "drawing",
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
      // Drawn right up to the page's top, under the frosted bar: the pile
      // fills the band behind it, the host's ticket sits below it.
      underHeader: true,
      // Drawn, no photo: the small line, the names and their line, the
      // details line along the main part's foot.
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "details",
      ],
    },
  ],
  fields: [
    {
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
    },
    {
      id: "kicker",
      label: { en: "highlight", ro: "evidențiere", hu: "kiemelés" },
      type: "text",
      maxLength: 60,
    },
    {
      // Names (name, mark, name) and a line under them for a couple; off,
      // two plain lines in their place, for any other event.
      id: "names",
      label: { en: "Use names", ro: "Folosește nume", hu: "Nevek használata" },
      type: "toggle",
      controls: ["namesStart", "namesMiddle", "namesEnd", "secondLine"],
      controlsOff: ["firstLine", "nextLine"],
    },
    {
      id: "namesStart",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "namesMiddle",
      label: {
        en: "mark",
        ro: "semn",
        hu: "jel",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "namesEnd",
      label: {
        en: "name",
        ro: "nume",
        hu: "név",
      },
      type: "text",
      maxLength: 40,
    },
    {
      id: "firstLine",
      label: { en: "first line", ro: "primul rând", hu: "első sor" },
      type: "text",
      maxLength: 40,
    },
    {
      id: "nextLine",
      label: { en: "second line", ro: "al doilea rând", hu: "második sor" },
      type: "text",
      maxLength: 40,
    },
    {
      id: "secondLine",
      label: { en: "second line", ro: "al doilea rând", hu: "második sor" },
      type: "text",
      maxLength: 40,
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
  ],
};
