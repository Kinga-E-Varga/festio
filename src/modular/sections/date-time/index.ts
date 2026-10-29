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
  required: true,
  order: 30,
  menuLabel: { en: "The day", ro: "Ziua", hu: "A nap" },
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
      shows: ["eventDate", "dateFormat"],
    },
    {
      id: "9",
      name: {
        en: "Colourful sticker",
        ro: "Autocolant colorat",
        hu: "Színes matrica",
      },
      // The date alone, as the title's stickers, in the accent.
      shows: ["eventDate", "dateFormat"],
    },
    {
      id: "4",
      name: {
        en: "Heading & date box",
        ro: "Titlu & casetă cu data",
        hu: "Cím & dátumdoboz",
      },
      // Every heading field but the italic heading.
      shows: [
        "eventDate",
        "dateFormat",
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
      ],
    },
    {
      id: "3",
      name: {
        en: "Calendar",
        ro: "Calendar",
        hu: "Naptár",
      },
      shows: ["eventDate", "eyebrow"],
    },
    {
      id: "7",
      name: {
        en: "Heading & date",
        ro: "Titlu & dată",
        hu: "Cím & dátum",
      },
      // Heading & date box without the box: every heading field but the italic heading.
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
