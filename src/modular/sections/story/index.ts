import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/**
 * A story (how the hosts met, a life, a company's history): a longer text with one photo (not a gallery),
 * or a few dated moments. Every style with the photo can leave it out
 * (`photos`).
 */
export const section: SectionDefinition = {
  id: "story",
  name: { en: "Story", ro: "Poveste", hu: "Történet" },
  required: false,
  order: 42,
  stylesHint: {
    en: "Two-line, Icon, the Full cards and Accent can leave the photo out: switch Use a photo off in the Content tab.",
    ro: "Două rânduri, Pictogramă, cardurile întregi și Accent pot fi fără fotografie: dezactivează Folosește o fotografie în fila Conținut.",
    hu: "A Kétsoros, az Ikon, a teljes kártyák és a Kiemelt mehetnek fotó nélkül: kapcsold ki a Fotó használata kapcsolót a Tartalom fülön.",
  },
  variants: [
    {
      id: "1",
      name: { en: "Two-line", ro: "Două rânduri", hu: "Kétsoros" },
      // No note: the story is the text under the heading.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "note"),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    // "2" is retired (Simple, now Two-line with the photo off): never reuse it.
    {
      id: "4",
      name: { en: "Icon", ro: "Pictogramă", hu: "Ikon" },
      // No eyebrow, italic line or note.
      shows: [
        "photos",
        ...ICON_HEADING_SHOWS.filter((id) => id !== "note"),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "6",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // The eyebrow and heading only, over the photo and the story.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "7",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Full card on the accent, no lines; always on the page's surface,
      // whatever its turn.
      ground: "surface",
      shows: [
        "photos",
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    {
      id: "8",
      name: { en: "Accent", ro: "Accent", hu: "Kiemelt" },
      // On the accent: every heading field but the italic heading, over
      // Full card accent's photo and story.
      ground: "accent",
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "story",
        "photo",
        "photoAlt",
      ],
    },
    // "5" is retired (Full card simple, now Full card with the photo off): never reuse it.
    {
      id: "3",
      name: { en: "Moments", ro: "Momente", hu: "Pillanatok" },
      // Simple's heading, eyebrow and heading only, over Schedule's Timeline, each moment's icon on its disc.
      shows: [
        ...HEADING_SHOWS.filter(
          (id) => id !== "headingItalic" && id !== "note",
        ),
        "moments.icon",
        "moments.year",
        "moments.title",
        "moments.text",
      ],
    },
  ],
  fields: [
    {
      id: "photos",
      label: {
        en: "use a photo",
        ro: "folosește o fotografie",
        hu: "fotó használata",
      },
      type: "toggle",
      controls: ["photo", "photoAlt"],
    },
    ...HEADING_FIELDS,
    {
      id: "story",
      label: { en: "story", ro: "povestea", hu: "történet" },
      type: "longText",
      maxLength: 1200,
    },
    {
      id: "photo",
      label: LABELS.photo,
      type: "image",
      maxLength: 200,
      required: true,
    },
    {
      id: "photoAlt",
      label: {
        en: "photo description",
        ro: "descrierea fotografiei",
        hu: "a fotó leírása",
      },
      type: "text",
      maxLength: 150,
    },
    {
      id: "moments",
      label: { en: "moments", ro: "momente", hu: "pillanatok" },
      itemLabel: { en: "moment", ro: "momentul", hu: "pillanat" },
      addLabel: {
        en: "add new moment",
        ro: "adaugă un moment nou",
        hu: "új pillanat hozzáadása",
      },
      type: "list",
      maxItems: 6,
      item: [
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        {
          id: "year",
          label: { en: "year", ro: "anul", hu: "év" },
          type: "text",
          maxLength: 12,
        },
        { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
        { id: "text", label: LABELS.text, type: "text", maxLength: 140 },
      ],
    },
  ],
};
