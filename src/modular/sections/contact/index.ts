import {
  HEADING_FIELDS,
  HEADING_SHOWS,
  ICON_HEADING_SHOWS,
} from "@/modular/heading";
import { ITEM_ICON, iconShows, iconSwitches } from "@/modular/item-marks";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** Every person's fields but their icon. */
const PERSON_SHOWS = [
  "people.role",
  "people.name",
  "people.phone",
  "people.email",
];

/** No italic second line under the heading. */
const PLAIN_HEADING = HEADING_SHOWS.filter((id) => id !== "headingItalic");

/** Someone guests can reach: a role, a name, a tap-to-call number and an email each. */
export const section: SectionDefinition = {
  id: "contact",
  name: { en: "Contact", ro: "Contact", hu: "Kapcsolat" },
  required: false,
  order: 142,
  variants: [
    {
      id: "1",
      name: { en: "Cards", ro: "Carduri", hu: "Kártyák" },
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "8",
      name: {
        en: "Cards accent",
        ro: "Carduri accent",
        hu: "Kiemelt kártyák",
      },
      // Cards, the cards on the accent, every disc in the secondary.
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "2",
      name: { en: "Grid", ro: "Grilă", hu: "Rács" },
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "9",
      name: { en: "Grid accent", ro: "Grilă accent", hu: "Rács kiemelt" },
      // Grid on the accent, each person's icon over their role.
      ground: "accent",
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "3",
      name: {
        en: "Two-line & list",
        ro: "Două rânduri & listă",
        hu: "Kétsoros & lista",
      },
      shows: [...HEADING_SHOWS, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "4",
      name: {
        en: "Icon & list",
        ro: "Pictogramă & listă",
        hu: "Ikon & lista",
      },
      // No eyebrow or italic line over the heading.
      shows: [...ICON_HEADING_SHOWS, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "5",
      name: {
        en: "Two-line & cards",
        ro: "Două rânduri & carduri",
        hu: "Kétsoros & kártyák",
      },
      // Two-line & list, each person a card.
      shows: [...HEADING_SHOWS, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "6",
      name: {
        en: "Icon & cards",
        ro: "Pictogramă & carduri",
        hu: "Ikon & kártyák",
      },
      // Icon & list, each person a card.
      shows: [...ICON_HEADING_SHOWS, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "7",
      name: { en: "Full card", ro: "Card întreg", hu: "Teljes kártya" },
      // Cards' (`1`) content, the people side by side in a full card.
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
    {
      id: "10",
      name: {
        en: "Full card accent",
        ro: "Card întreg accent",
        hu: "Kiemelt teljes kártya",
      },
      // Full card on the accent, no lines, every disc in the
      // secondary; always on the page's surface, whatever its turn.
      ground: "surface",
      shows: [...PLAIN_HEADING, ...iconShows("people"), ...PERSON_SHOWS],
    },
  ],
  fields: [
    ...HEADING_FIELDS,
    ...iconSwitches("people"),
    {
      id: "people",
      label: { en: "people", ro: "persoane", hu: "személyek" },
      itemLabel: { en: "person", ro: "persoana", hu: "személy" },
      addLabel: {
        en: "add new person",
        ro: "adaugă o persoană nouă",
        hu: "új személy hozzáadása",
      },
      type: "list",
      maxItems: 4,
      item: [
        ITEM_ICON,
        {
          id: "role",
          label: { en: "role", ro: "rol", hu: "szerep" },
          type: "text",
          maxLength: 40,
        },
        { id: "name", label: LABELS.name, type: "text", maxLength: 60 },
        {
          id: "phone",
          label: { en: "phone", ro: "telefon", hu: "telefon" },
          type: "phone",
          maxLength: 24,
        },
        {
          id: "email",
          label: { en: "email", ro: "e-mail", hu: "e-mail" },
          type: "email",
          maxLength: 80,
        },
      ],
    },
  ],
};
