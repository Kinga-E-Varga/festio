import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/**
 * One to three locations, each with its own venue, address and photo — the
 * invitation's, not the event's. Every style's `photos` switch leaves the
 * photos out.
 */
export const section: SectionDefinition = {
  id: "location",
  name: { en: "Location", ro: "Locația", hu: "Helyszín" },
  required: true,
  order: 50,
  stylesHint: {
    en: "Every style can leave the photos out: switch Use photos off in the Content tab.",
    ro: "Orice stil poate fi fără fotografii: dezactivează Folosește fotografii în fila Conținut.",
    hu: "Bármelyik stílus mehet fotók nélkül: kapcsold ki a Fotók használata kapcsolót a Tartalom fülön.",
  },
  variants: [
    {
      id: "1",
      name: {
        en: "Accent cards",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Every heading field but the italic heading.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
        "venues.icon",
      ],
    },
    {
      id: "6",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      // Accent cards on a surface: every heading field but the italic heading.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
        "venues.icon",
      ],
    },
    {
      id: "2",
      name: {
        en: "Simple",
        ro: "Simplu",
        hu: "Egyszerű",
      },
      shows: [
        "photos",
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
      ],
    },
    {
      id: "7",
      name: {
        en: "Two-line",
        ro: "Două rânduri",
        hu: "Kétsoros",
      },
      // Simple with an italic line under each name, as a two-line heading.
      shows: [
        "photos",
        "venues.label",
        "venues.venue",
        "venues.headingItalic",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
      ],
    },
    // "4" is retired (Cards, now Cards with photos off): never reuse it.
    {
      id: "5",
      name: {
        en: "Icon",
        ro: "Pictogramă",
        hu: "Ikon",
      },
      // Simple with the icon where the label goes.
      shows: [
        "photos",
        "venues.icon",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
      ],
    },
    {
      id: "3",
      name: {
        en: "List & grid",
        ro: "Listă & grilă",
        hu: "Lista & rács",
      },
      // Every heading field but the italic heading.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
      ],
    },
    {
      id: "8",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // List & grid in one card: every heading field but the italic heading.
      shows: [
        "photos",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "venues.icon",
        "venues.label",
        "venues.venue",
        "venues.address",
        "venues.mapsLink",
        "venues.detail",
        "venues.photo",
      ],
    },
  ],
  fields: [
    {
      id: "photos",
      label: {
        en: "use photos",
        ro: "folosește fotografii",
        hu: "fotók használata",
      },
      type: "toggle",
      controls: ["venues.photo"],
    },
    ...HEADING_FIELDS,
    {
      id: "venues",
      label: { en: "locations", ro: "locații", hu: "helyszínek" },
      itemLabel: { en: "location", ro: "locația", hu: "helyszín" },
      addLabel: {
        en: "add new location",
        ro: "adaugă o locație nouă",
        hu: "új helyszín hozzáadása",
      },
      type: "list",
      maxItems: 3,
      minItems: 1,
      item: [
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        {
          id: "label",
          label: {
            en: "what happens here",
            ro: "ce are loc aici",
            hu: "mi lesz itt",
          },
          type: "text",
          maxLength: 40,
        },
        { id: "venue", label: LABELS.place, type: "text", maxLength: 80 },
        {
          id: "headingItalic",
          label: LABELS.headingItalic,
          type: "text",
          maxLength: 80,
        },
        {
          id: "address",
          label: LABELS.address,
          type: "longText",
          maxLength: 160,
        },
        {
          id: "mapsLink",
          label: {
            en: "maps link",
            ro: "link de hartă",
            hu: "térképlink",
          },
          type: "text",
          maxLength: 300,
        },
        {
          id: "detail",
          label: LABELS.note,
          type: "longText",
          maxLength: 80,
        },
        { id: "photo", label: LABELS.photo, type: "image", maxLength: 300 },
      ],
    },
  ],
};
