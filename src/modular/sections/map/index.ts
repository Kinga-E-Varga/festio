import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "map",
  name: { en: "Map", ro: "Hartă", hu: "Térkép" },
  required: false,
  order: 60,
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Around the venue",
        ro: "În jurul locației",
        hu: "A helyszín környékén",
      },
    },
    {
      id: "places",
      label: { en: "places", ro: "locuri", hu: "helyek" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 40 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 80 },
        { id: "address", label: LABELS.address, type: "text", maxLength: 120 },
      ],
      fallback: [
        {
          name: "Conacul Bragadiru",
          note: {
            en: "Ceremony and reception",
            ro: "Ceremonia și recepția",
            hu: "Szertartás és fogadás",
          },
          address: "Calea Rahovei 147, Bucharest",
        },
        {
          name: { en: "Parking", ro: "Parcare", hu: "Parkoló" },
          note: {
            en: "Free on site, overnight allowed",
            ro: "Gratuită, se poate rămâne peste noapte",
            hu: "Ingyenes, éjszakára is ott hagyható",
          },
          address: "Calea Rahovei 147, Bucharest",
        },
        {
          name: {
            en: "Shuttle stop",
            ro: "Stația de transfer",
            hu: "Transzferbusz-megálló",
          },
          note: {
            en: "Piața Unirii, by the fountain",
            ro: "Piața Unirii, lângă fântână",
            hu: "Piața Unirii, a szökőkútnál",
          },
          address: "Piața Unirii, Bucharest",
        },
      ],
    },
  ],
};
