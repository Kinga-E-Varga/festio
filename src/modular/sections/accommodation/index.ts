import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "accommodation",
  name: { en: "Accommodation", ro: "Cazare", hu: "Szállás" },
  required: false,
  order: 120,
  menuLabel: {
    en: "Stay & travel",
    ro: "Cazare și transport",
    hu: "Szállás és utazás",
  },
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Where to stay",
        ro: "Unde te poți caza",
        hu: "Hol szállhatsz meg",
      },
    },
    {
      id: "places",
      label: { en: "places to stay", ro: "locuri de cazare", hu: "szállások" },
      type: "list",
      maxItems: 6,
      item: [
        { id: "name", label: LABELS.name, type: "text", maxLength: 60 },
        {
          id: "distance",
          label: { en: "distance", ro: "distanță", hu: "távolság" },
          type: "text",
          maxLength: 40,
        },
        {
          id: "price",
          label: { en: "price", ro: "preț", hu: "ár" },
          type: "text",
          maxLength: 30,
        },
        {
          id: "until",
          label: {
            en: "rooms held until",
            ro: "camere rezervate până pe",
            hu: "szobák foglalva eddig",
          },
          type: "text",
          maxLength: 30,
        },
        {
          id: "link",
          label: { en: "website", ro: "site", hu: "weboldal" },
          type: "text",
          maxLength: 200,
        },
      ],
      fallback: [
        {
          name: "Hotel Rahova",
          distance: {
            en: "8 min by car",
            ro: "8 min cu mașina",
            hu: "8 perc autóval",
          },
          price: { en: "from 320 RON", ro: "de la 320 RON", hu: "320 RON-tól" },
          until: { en: "1 May", ro: "1 mai", hu: "május 1." },
          link: "https://example.com",
        },
        {
          name: "Casa Verde",
          distance: {
            en: "Walking distance",
            ro: "La câțiva pași",
            hu: "Gyalog is elérhető",
          },
          price: { en: "from 250 RON", ro: "de la 250 RON", hu: "250 RON-tól" },
          until: "",
          link: "https://example.com",
        },
        {
          name: "Hotel Unirii",
          distance: {
            en: "15 min by car",
            ro: "15 min cu mașina",
            hu: "15 perc autóval",
          },
          price: { en: "from 400 RON", ro: "de la 400 RON", hu: "400 RON-tól" },
          until: "",
          link: "",
        },
      ],
    },
  ],
};
