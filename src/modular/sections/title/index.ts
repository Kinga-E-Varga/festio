import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/**
 * The names, large, in three parts like the header's mark, between two
 * lines; or, with Use names off, two plain title lines in their place.
 */
export const section: SectionDefinition = {
  id: "title",
  name: { en: "Title", ro: "Titlu", hu: "Cím" },
  required: true,
  order: 20,
  variants: [
    {
      id: "1",
      name: { en: "Colourful", ro: "Colorat", hu: "Színes" },
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "caption",
      ],
    },
    {
      id: "4",
      name: {
        en: "Sticker colourful",
        ro: "Autocolant colorat",
        hu: "Matrica színes",
      },
      shows: [
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
      id: "2",
      name: { en: "Simple", ro: "Simplu", hu: "Egyszerű" },
      shows: [
        "eyebrow",
        "names",
        "namesStart",
        "namesMiddle",
        "namesEnd",
        "firstLine",
        "nextLine",
        "secondLine",
        "caption",
      ],
    },
    {
      id: "3",
      name: {
        en: "Sticker accent",
        ro: "Autocolant accent",
        hu: "Matrica kiemelt",
      },
      shows: [
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
      name: {
        en: "Sticker simple",
        ro: "Autocolant simplu",
        hu: "Matrica egyszerű",
      },
      shows: [
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
      id: "eyebrow",
      label: LABELS.eyebrow,
      type: "text",
      maxLength: 60,
    },
    {
      // Names (name, mark, name) and a title line for a couple; off, two
      // plain title lines in their place, for any other event.
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
      id: "caption",
      label: { en: "short message", ro: "mesaj scurt", hu: "rövid üzenet" },
      // A box, so the host can break it into lines.
      type: "longText",
      maxLength: 120,
    },
  ],
};
