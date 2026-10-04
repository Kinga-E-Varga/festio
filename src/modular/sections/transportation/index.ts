import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "transportation",
  name: { en: "Transportation", ro: "Transport", hu: "Közlekedés" },
  required: false,
  order: 72,
  menuLabel: { en: "Getting there", ro: "Cum ajungi", hu: "Odajutás" },
  variants: [
    { id: "cards", name: { en: "Cards", ro: "Carduri", hu: "Kártyák" } },
  ],
  fields: [
    ...headingFields({
      eyebrow: {
        en: "Getting here, together",
        ro: "Cum ajungem, împreună",
        hu: "Együtt odajutni",
      },
      heading: {
        en: "The journey is part of it",
        ro: "Drumul face parte din poveste",
        hu: "Az út is a része",
      },
    }),
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
        { id: "label", label: LABELS.eyebrow, type: "text", maxLength: 30 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "text", label: LABELS.text, type: "longText", maxLength: 240 },
      ],
      fallback: [
        {
          label: { en: "By train", ro: "Cu trenul", hu: "Vonattal" },
          title: {
            en: "Come via Pontedera",
            ro: "Prin Pontedera",
            hu: "Pontederán keresztül",
          },
          text: {
            en: "Take the train to Pontedera–Casciana Terme. From there, the villa is about a 30-minute drive.",
            ro: "Luați trenul până la Pontedera–Casciana Terme. De acolo, vila e la circa 30 de minute cu mașina.",
            hu: "Vonattal Pontedera–Casciana Terméig. Onnan a villa nagyjából 30 perc autóval.",
          },
        },
        {
          label: { en: "A little lift", ro: "Te ducem noi", hu: "Elviszünk" },
          title: {
            en: "We’ll arrange a shuttle",
            ro: "Organizăm un transfer",
            hu: "Transzfert szervezünk",
          },
          text: {
            en: "Shared rides will run between Pontedera station, the villa, and nearby stays. Add your arrival details to your reply.",
            ro: "Vor fi curse comune între gara Pontedera, vilă și cazările din apropiere. Scrie-ne în răspuns când ajungi.",
            hu: "Közös járatok lesznek a pontederai állomás, a villa és a közeli szállások között. A válaszban írd meg, mikor érkezel.",
          },
        },
        {
          label: { en: "By car", ro: "Cu mașina", hu: "Autóval" },
          title: {
            en: "Room to park",
            ro: "Loc de parcare",
            hu: "Van hely parkolni",
          },
          text: {
            en: "There’s free parking on the estate. We’ll share the final directions and shuttle times closer to the weekend.",
            ro: "Parcarea pe domeniu e gratuită. Vă trimitem indicațiile și orele transferului mai aproape de weekend.",
            hu: "A birtokon ingyenes a parkolás. A pontos útvonalat és a transzfer idejét a hétvége előtt küldjük.",
          },
        },
      ],
    },
  ],
};
