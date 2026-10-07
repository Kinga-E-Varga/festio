import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "schedule",
  name: { en: "Schedule", ro: "Program", hu: "Program" },
  required: false,
  order: 70,
  menuLabel: { en: "Schedule", ro: "Program", hu: "Program" },
  variants: [
    {
      id: "1",
      name: {
        en: "List with icons",
        ro: "Listă cu pictograme",
        hu: "Lista ikonokkal",
      },
      shows: [
        ...HEADING_SHOWS,
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        "days.items.icon",
      ],
    },
    {
      id: "2",
      name: {
        en: "Icon and list",
        ro: "Pictogramă și listă",
        hu: "Ikon és lista",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "days",
      label: { en: "days", ro: "zile", hu: "napok" },
      type: "groups",
      maxGroups: 4,
      groupLabel: { en: "day", ro: "ziua", hu: "nap" },
      addLabel: {
        en: "add new day",
        ro: "adaugă o zi nouă",
        hu: "új nap hozzáadása",
      },
      group: [
        {
          id: "date",
          label: { en: "date", ro: "data", hu: "dátum" },
          type: "date",
          maxLength: 10,
        },
      ],
      items: {
        label: { en: "events", ro: "evenimente", hu: "programpontok" },
        itemLabel: { en: "event", ro: "evenimentul", hu: "programpont" },
        addLabel: {
          en: "add event to day {n}",
          ro: "adaugă un eveniment în ziua {n}",
          hu: "programpont hozzáadása: nap {n}",
        },
        maxItems: 6,
        item: [
          { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
          { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
          { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
          { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        ],
      },
    },
  ],
};
