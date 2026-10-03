import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "accommodation",
  name: { en: "Accommodation", ro: "Cazare", hu: "Szállás" },
  required: false,
  order: 75,
  menuLabel: { en: "Accommodation", ro: "Cazare", hu: "Szállás" },
  fields: [
    ...headingFields({
      eyebrow: {
        en: "Make a weekend of it",
        ro: "Fă din asta un weekend",
        hu: "Legyen belőle egy hétvége",
      },
      heading: {
        en: "A soft place to land",
        ro: "Un loc liniștit de cazare",
        hu: "Egy puha hely a pihenéshez",
      },
      note: {
        en: "We’ve gathered a few stays nearby, from a room at the villa to a hilltop hideaway.",
        ro: "Am adunat câteva cazări în apropiere, de la o cameră la vilă la un refugiu pe deal.",
        hu: "Összegyűjtöttünk néhány közeli szállást, a villa szobáitól egy dombtetői búvóhelyig.",
      },
    }),
    {
      id: "places",
      label: { en: "places to stay", ro: "locuri de cazare", hu: "szállások" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 60 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 60 },
        {
          id: "distance",
          label: { en: "side note", ro: "notă laterală", hu: "oldaljegyzet" },
          type: "text",
          maxLength: 40,
        },
        { id: "link", label: LABELS.link, type: "text", maxLength: 300 },
      ],
      fallback: [
        {
          name: "Villa Lena",
          note: {
            en: "On the estate · limited rooms",
            ro: "Pe domeniu · camere puține",
            hu: "A birtokon · kevés szoba",
          },
          distance: {
            en: "The easiest stay",
            ro: "Cea mai simplă variantă",
            hu: "A legkényelmesebb",
          },
          link: "https://www.villalena.it/",
        },
        {
          name: "Borgo di Colleoli",
          note: {
            en: "Country house · 10 min drive",
            ro: "Casă la țară · 10 min cu mașina",
            hu: "Vidéki ház · 10 perc autóval",
          },
          distance: {
            en: "A little extra quiet",
            ro: "Ceva mai liniștit",
            hu: "Egy kicsit csendesebb",
          },
          link: "https://www.google.com/maps/search/hotels+Palaia+Tuscany",
        },
        {
          name: "San Miniato",
          note: {
            en: "Town stays · 25 min drive",
            ro: "Cazări în oraș · 25 min cu mașina",
            hu: "Városi szállások · 25 perc autóval",
          },
          distance: {
            en: "More places to explore",
            ro: "Mai multe de explorat",
            hu: "Több felfedeznivaló",
          },
          link: "https://www.google.com/maps/search/hotels+San+Miniato+Italy",
        },
      ],
    },
  ],
};
