import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "location",
  name: { en: "Location", ro: "Locația", hu: "Helyszín" },
  required: true,
  order: 50,
  fields: [
    {
      id: "notes",
      label: {
        en: "practical notes",
        ro: "informații practice",
        hu: "gyakorlati tudnivalók",
      },
      type: "list",
      maxItems: 4,
      item: [
        {
          id: "label",
          label: { en: "label", ro: "etichetă", hu: "címke" },
          type: "text",
          maxLength: 20,
        },
        {
          id: "value",
          label: { en: "note", ro: "notă", hu: "megjegyzés" },
          type: "text",
          maxLength: 80,
        },
      ],
      fallback: [
        {
          label: { en: "Parking", ro: "Parcare", hu: "Parkolás" },
          value: {
            en: "Free on site",
            ro: "Gratuită, la fața locului",
            hu: "Ingyenes, a helyszínen",
          },
        },
        {
          label: { en: "Access", ro: "Acces", hu: "Akadálymentesség" },
          value: {
            en: "Step-free entrance from the courtyard",
            ro: "Intrare fără trepte din curte",
            hu: "Lépcsőmentes bejárat az udvar felől",
          },
        },
      ],
    },
  ],
};
