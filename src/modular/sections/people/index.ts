import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** Every group's fields but its icon. */
const GROUP_SHOWS = ["groups.label", "groups.names"];

/**
 * The people who stand with the hosts: parents, godparents, witnesses, in
 * groups, each a label ("Parents of the bride", "Godparents") over up to
 * six names.
 */
export const section: SectionDefinition = {
  id: "people",
  name: {
    en: "Special people",
    ro: "Persoane speciale",
    hu: "Különleges emberek",
  },
  required: false,
  order: 45,
  variants: [
    {
      id: "1",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      // No italic second line under the heading, as the other grids.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        ...GROUP_SHOWS,
      ],
    },
    {
      id: "2",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      // No italic second line under the heading.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "groups.icon",
        ...GROUP_SHOWS,
      ],
    },
    {
      id: "3",
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [...HEADING_SHOWS, "groups.icon", ...GROUP_SHOWS],
    },
    {
      id: "4",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      // No eyebrow or italic line over the heading.
      shows: [...ICON_HEADING_SHOWS, "groups.icon", ...GROUP_SHOWS],
    },
    {
      id: "5",
      name: {
        en: "Two-line & cards",
        ro: "Două rânduri & carduri",
        hu: "Kétsoros & kártyák",
      },
      // Two-line & list, each group a card.
      shows: [...HEADING_SHOWS, "groups.icon", ...GROUP_SHOWS],
    },
    {
      id: "6",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă & carduri",
        hu: "Ikon & kártyák",
      },
      // Icon & list, each group a card.
      shows: [...ICON_HEADING_SHOWS, "groups.icon", ...GROUP_SHOWS],
    },
    {
      id: "7",
      name: {
        en: "Full card & grid",
        ro: "Card întreg & grilă",
        hu: "Teljes kártya & rács",
      },
      // Cards' (`2`) content, the groups side by side in a full card.
      shows: [
        ...HEADING_SHOWS.filter((id) => id !== "headingItalic"),
        "groups.icon",
        ...GROUP_SHOWS,
      ],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    {
      id: "groups",
      label: { en: "groups", ro: "grupuri", hu: "csoportok" },
      itemLabel: { en: "group", ro: "grupul", hu: "csoport" },
      addLabel: {
        en: "add new group",
        ro: "adaugă un grup nou",
        hu: "új csoport hozzáadása",
      },
      type: "list",
      maxItems: 4,
      item: [
        { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 40 },
        {
          id: "names",
          label: { en: "names", ro: "nume", hu: "nevek" },
          type: "lines",
          maxLength: 60,
          maxLines: 6,
          addLabel: {
            en: "add name",
            ro: "adaugă un nume",
            hu: "név hozzáadása",
          },
        },
      ],
    },
  ],
};
