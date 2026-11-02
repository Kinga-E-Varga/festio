import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { ITEM_ICON, iconShows, iconSwitches } from "@/modular/item-marks";
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
        ...iconShows("days.items"),
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
        ...iconShows("days.items"),
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
      id: "9",
      name: {
        en: "Cards accent",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Cards, the cards on the accent.
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
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      // Every heading field but the italic heading; the days side by side, no lines.
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
      // Every heading field but the italic heading; the note empty to start.
      unsampled: ["note"],
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        ...iconShows("days.items"),
      ],
    },
    {
      id: "10",
      name: {
        en: "Timeline accent",
        ro: "Cronologie accent",
        hu: "Idővonal kiemelt",
      },
      // Timeline on the accent, every disc in the secondary.
      ground: "accent",
      unsampled: ["note"],
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        ...iconShows("days.items"),
      ],
    },
    {
      id: "11",
      name: {
        en: "Full card timeline accent",
        ro: "Card întreg cronologie accent",
        hu: "Kiemelt teljes kártya, idővonal",
      },
      // Timeline in a full card on the accent, every disc in the secondary;
      // always on the page's surface, whatever its turn.
      ground: "surface",
      unsampled: ["note"],
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        ...iconShows("days.items"),
      ],
    },
    {
      id: "8",
      name: {
        en: "Full card alternate",
        ro: "Card întreg alternant",
        hu: "Teljes kártya, váltakozó",
      },
      // Alternate in a full card: every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "13",
      name: { en: "Alternate", ro: "Alternant", hu: "Váltakozó" },
      // Icon & list's (`2`) days, each event split at the middle, the times
      // taking turns left and right; every heading field but the italic heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
      ],
    },
    {
      id: "12",
      name: {
        en: "Full card timeline",
        ro: "Card întreg cronologie",
        hu: "Teljes kártya, idővonal",
      },
      // Timeline in a full card on its own ground; the note empty to start.
      unsampled: ["note"],
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "days.date",
        "days.items.time",
        "days.items.title",
        "days.items.note",
        ...iconShows("days.items"),
      ],
    },
    // "9" is retired (Full card & timeline): never reuse it.
  ],
  fields: [
    ...HEADING_FIELDS,
    ...iconSwitches("days.items"),
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
          ITEM_ICON,
        ],
      },
    },
  ],
};
