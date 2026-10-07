import { HEADING_FIELDS, HEADING_SHOWS } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

/**
 * The event's date; the id stays `date-time`, as ids are permanent. Every
 * variant shows the heading's `note`.
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
      name: { en: "Calendar card", ro: "Card calendar", hu: "Naptárkártya" },
      shows: ["eventDate", ...HEADING_SHOWS],
    },
    {
      id: "2",
      name: {
        en: "Accent & big date",
        ro: "Accent și dată mare",
        hu: "Kiemelés és nagy dátum",
      },
      ground: "accent",
      shows: ["eventDate", "dateFormat", "note"],
    },
    {
      id: "3",
      name: {
        en: "Tear-off",
        ro: "Calendar de perete",
        hu: "Letéphető naptár",
      },
      shows: ["eventDate", ...HEADING_SHOWS],
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
    ...HEADING_FIELDS,
  ],
};
