import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "transportation",
  name: { en: "Transportation", ro: "Transport", hu: "Közlekedés" },
  required: false,
  order: 130,
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Getting there and back",
        ro: "Cum ajungi și cum te întorci",
        hu: "Oda és vissza",
      },
    },
    {
      id: "ways",
      label: {
        en: "ways to arrive",
        ro: "moduri de a ajunge",
        hu: "érkezési módok",
      },
      type: "list",
      maxItems: 4,
      item: [
        /* One of `shuttle`, `car`, `taxi`, `plane`; anything else draws a pin. */
        {
          id: "icon",
          label: { en: "icon", ro: "pictogramă", hu: "ikon" },
          type: "text",
          maxLength: 10,
        },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.text, type: "longText", maxLength: 160 },
      ],
      fallback: [
        {
          icon: "shuttle",
          title: { en: "Shuttle", ro: "Transfer", hu: "Transzferbusz" },
          text: {
            en: "Out 15:00 from Piața Unirii. Back 00:30 and 02:00.",
            ro: "Plecare la 15:00 din Piața Unirii. Întoarcere la 00:30 și 02:00.",
            hu: "Indulás 15:00-kor a Piața Uniriiről. Vissza 00:30-kor és 02:00-kor.",
          },
        },
        {
          icon: "car",
          title: { en: "By car", ro: "Cu mașina", hu: "Autóval" },
          text: {
            en: "Free parking on site. Cars may stay overnight.",
            ro: "Parcare gratuită la fața locului. Mașinile pot rămâne peste noapte.",
            hu: "Ingyenes parkolás a helyszínen. Az autók éjszakára is maradhatnak.",
          },
        },
        {
          icon: "taxi",
          title: { en: "Taxi", ro: "Taxi", hu: "Taxi" },
          text: {
            en: "Book ahead after midnight.",
            ro: "După miezul nopții, rezervă din timp.",
            hu: "Éjfél után érdemes előre foglalni.",
          },
        },
        {
          icon: "plane",
          title: {
            en: "From the airport",
            ro: "De la aeroport",
            hu: "A repülőtérről",
          },
          text: {
            en: "Otopeni is 25 minutes away by taxi.",
            ro: "Aeroportul Otopeni e la 25 de minute cu taxiul.",
            hu: "Az otopeni repülőtér taxival 25 percre van.",
          },
        },
      ],
    },
  ],
};
