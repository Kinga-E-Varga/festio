import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/**
 * The event's date; the id stays `date-time`, as ids are permanent. Every
 * variant but Calendar, the calendar under its eyebrow, and Framed day and
 * the stickers, the date alone, shows the heading's `note`.
 */
export const section: SectionDefinition = {
  id: "date-time",
  name: { en: "Date", ro: "Data", hu: "Dátum" },
  // Every cover shows the date, so the host may switch this off.
  required: false,
  order: 30,
  menuLabel: { en: "Date", ro: "Data", hu: "Dátum" },
  variants: [
    {
      id: "1",
      name: {
        en: "Two-line & box",
        ro: "Două rânduri & casetă",
        hu: "Kétsoros & doboz",
      },
      split: true,
      shows: ["eventDate", ...HEADING_SHOWS],
    },
    {
      id: "6",
      name: { en: "Icon & box", ro: "Pictogramă & casetă", hu: "Ikon & doboz" },
      split: true,
      // No eyebrow, no italic heading.
      shows: ["eventDate", ...ICON_HEADING_SHOWS],
    },
    {
      id: "2",
      name: {
        en: "Simple accent",
        ro: "Accent simplu",
        hu: "Egyszerű kiemelés",
      },
      ground: "accent",
      shows: ["eventDate", "dateFormat", "note"],
    },
    {
      id: "8",
      name: {
        en: "Sticker simple",
        ro: "Autocolant simplu",
        hu: "Matrica egyszerű",
      },
      // The date alone, as the title's stickers, in the ink.
      bare: true,
      shows: ["eventDate", "dateFormat"],
    },
    {
      id: "9",
      name: {
        en: "Sticker colourful",
        ro: "Autocolant colorat",
        hu: "Matrica színes",
      },
      // The date alone, as the title's stickers, in the accent.
      bare: true,
      shows: ["eventDate", "dateFormat"],
    },
    {
      id: "10",
      name: {
        en: "Full card soft",
        ro: "Card întreg discret",
        hu: "Teljes kártya, lágy",
      },
      // Full card accent's date and note, the card in the surface.
      bare: true,
      shows: ["eventDate", "dateFormat", "note"],
      card: "surface",
    },
    {
      id: "11",
      name: {
        en: "Full card hard",
        ro: "Card întreg marcat",
        hu: "Teljes kártya, erős",
      },
      // Full card accent's date and note, the card in the second surface.
      bare: true,
      shows: ["eventDate", "dateFormat", "note"],
      card: "surface-alt",
    },
    {
      id: "4",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Simple accent's date and note in one card on the accent; always on
      // the page's surface, whatever its turn.
      ground: "surface",
      bare: true,
      shows: ["eventDate", "dateFormat", "note"],
    },
    {
      id: "3",
      name: {
        en: "Calendar",
        ro: "Calendar",
        hu: "Naptár",
      },
      bare: true,
      shows: ["eventDate", "eyebrow"],
    },
    {
      id: "7",
      name: {
        en: "Heading & date",
        ro: "Titlu & dată",
        hu: "Cím & dátum",
      },
      // Every heading field but the italic heading.
      shows: [
        "eventDate",
        "dateFormat",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
      ],
    },
    {
      id: "5",
      name: { en: "Framed day", ro: "Zi încadrată", hu: "Keretezett nap" },
      // The date alone: no heading.
      shows: ["eventDate", "monthName"],
    },
  ],
  fields: [
    {
      id: "eventDate",
      label: { en: "date", ro: "data", hu: "dátum" },
      type: "eventDate",
    },
    {
      id: "dateFormat",
      label: { en: "date format", ro: "formatul datei", hu: "dátumformátum" },
      type: "dateFormat",
    },
    {
      id: "monthName",
      label: { en: "month name", ro: "numele lunii", hu: "a hónap neve" },
      type: "choice",
      options: [
        { id: "long", label: { en: "full", ro: "complet", hu: "teljes" } },
        { id: "short", label: { en: "short", ro: "scurt", hu: "rövid" } },
      ],
    },
    ...HEADING_FIELDS,
  ],
};
