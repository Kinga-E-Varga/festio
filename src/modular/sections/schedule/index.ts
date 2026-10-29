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
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
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
      id: "6",
      name: {
        en: "Two-line & cards",
        ro: "Două rânduri & carduri",
        hu: "Kétsoros & kártyák",
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
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      // No italic second line under the heading.
      shows: [
        ...ICON_HEADING_SHOWS,
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "7",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă & carduri",
        hu: "Ikon & kártyák",
      },
      shows: [
        ...ICON_HEADING_SHOWS,
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "5",
      name: {
        en: "Cards",
        ro: "Carduri",
        hu: "Kártyák",
      },
      // Grid's (`3`) fields: every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "3",
      name: {
        en: "Grid",
        ro: "Grilă",
        hu: "Rács",
      },
      // Every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "4",
      name: {
        en: "Timeline",
        ro: "Cronologie",
        hu: "Idővonal",
      },
      // No heading: the timeline alone.
      shows: [
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        "days.items.icon",
      ],
    },
    {
      id: "8",
      name: {
        en: "Full card alternate",
        ro: "Card întreg alternat",
        hu: "Teljes kártya váltakozó",
      },
      // Icon & list's (`2`) days under every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    // "9" is retired (Full card & timeline): never reuse it.
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
