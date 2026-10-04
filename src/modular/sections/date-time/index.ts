import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

/** The countdown reads `moments`: it counts to the first one's time. */
export const section: SectionDefinition = {
  id: "date-time",
  name: { en: "Date & time", ro: "Data și ora", hu: "Dátum és időpont" },
  required: true,
  order: 30,
  menuLabel: { en: "The day", ro: "Ziua", hu: "A nap" },
  variants: [
    {
      id: "calendar-card",
      name: { en: "Calendar card", ro: "Card calendar", hu: "Naptárkártya" },
    },
  ],
  fields: [
    ...headingFields({
      eyebrow: {
        en: "Mark your calendar",
        ro: "Notează în calendar",
        hu: "Jelöld be a naptárban",
      },
      heading: {
        en: "A day to remember.",
        ro: "O zi de neuitat.",
        hu: "Egy nap, amit nem felejtünk.",
      },
      headingItalic: {
        en: "A weekend to savor.",
        ro: "Un weekend de savurat.",
        hu: "Egy hétvége, amit kiélvezünk.",
      },
      note: {
        en: "We can’t wait to gather beneath the Tuscan sky with all of our favorite people.",
        ro: "Abia așteptăm să ne strângem sub cerul Toscanei cu toți cei dragi.",
        hu: "Alig várjuk, hogy a toszkán ég alatt együtt legyünk mindenkivel, akit szeretünk.",
      },
    }),
    {
      id: "moments",
      label: {
        en: "parts of the day",
        ro: "momentele zilei",
        hu: "a nap részei",
      },
      type: "list",
      maxItems: 4,
      item: [
        { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
        { id: "title", label: LABELS.title, type: "text", maxLength: 40 },
        { id: "place", label: LABELS.place, type: "text", maxLength: 60 },
      ],
      fallback: [
        {
          time: "15:30",
          title: { en: "Ceremony", ro: "Ceremonia", hu: "Szertartás" },
        },
      ],
    },
  ],
};
