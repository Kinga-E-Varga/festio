import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "schedule",
  name: { en: "Schedule", ro: "Program", hu: "Program" },
  required: false,
  order: 70,
  menuLabel: { en: "Schedule", ro: "Program", hu: "Program" },
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "How the day runs",
        ro: "Cum decurge ziua",
        hu: "A nap menete",
      },
    },
    {
      id: "items",
      label: { en: "moments", ro: "momente", hu: "programpontok" },
      type: "list",
      maxItems: 10,
      item: [
        { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
      ],
      fallback: [
        {
          time: "15:30",
          title: {
            en: "Guests arrive",
            ro: "Sosirea invitaților",
            hu: "Vendégvárás",
          },
          note: {
            en: "Welcome drinks in the courtyard.",
            ro: "Băuturi de bun venit în curte.",
            hu: "Üdvözlőital az udvaron.",
          },
        },
        {
          time: "16:00",
          title: { en: "Ceremony", ro: "Ceremonia", hu: "Szertartás" },
          note: {
            en: "In the walled garden. Be seated by 15:50.",
            ro: "În grădina cu ziduri. Te rugăm să fii așezat până la 15:50.",
            hu: "A fallal körülvett kertben. 15:50-re kérünk a helyedre.",
          },
        },
        {
          time: "17:00",
          title: { en: "Photographs", ro: "Fotografii", hu: "Fotózás" },
          note: {
            en: "Group photos on the terrace steps.",
            ro: "Fotografii de grup pe treptele terasei.",
            hu: "Csoportképek a terasz lépcsőin.",
          },
        },
        {
          time: "18:30",
          title: { en: "Dinner", ro: "Cina", hu: "Vacsora" },
          note: {
            en: "Seating chart at the entrance.",
            ro: "Planul meselor e la intrare.",
            hu: "Az ültetési rend a bejáratnál.",
          },
        },
        {
          time: "21:00",
          title: {
            en: "First dance, then music",
            ro: "Primul dans, apoi muzică",
            hu: "Nyitótánc, aztán zene",
          },
          note: {
            en: "Until late.",
            ro: "Până târziu.",
            hu: "Késő éjszakáig.",
          },
        },
      ],
    },
  ],
};
