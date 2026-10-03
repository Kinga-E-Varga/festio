import { headingFields } from "@/modular/heading";
import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "schedule",
  name: { en: "Schedule", ro: "Program", hu: "Program" },
  required: false,
  order: 70,
  menuLabel: { en: "Schedule", ro: "Program", hu: "Program" },
  fields: [
    ...headingFields({
      eyebrow: {
        en: "The whole lovely weekend",
        ro: "Tot weekendul",
        hu: "Az egész hétvége",
      },
      heading: {
        en: "Come for the vows.",
        ro: "Veniți pentru jurăminte.",
        hu: "Gyertek az eskü miatt,",
      },
      headingItalic: {
        en: "Stay for the stories.",
        ro: "Rămâneți pentru povești.",
        hu: "maradjatok a történetekért.",
      },
      note: {
        en: "We’ve made a little room in the schedule for the things that matter: good food, old friends, and a slow Sunday morning.",
        ro: "Am lăsat loc în program pentru ce contează: mâncare bună, prieteni vechi și o dimineață de duminică fără grabă.",
        hu: "Hagytunk helyet a programban a fontos dolgoknak: jó ételeknek, régi barátoknak és egy ráérős vasárnap reggelnek.",
      },
    }),
    {
      id: "days",
      label: { en: "days", ro: "zile", hu: "napok" },
      type: "groups",
      maxGroups: 4,
      group: [
        {
          id: "label",
          label: { en: "day", ro: "ziua", hu: "nap" },
          type: "text",
          maxLength: 40,
        },
      ],
      items: {
        label: { en: "events", ro: "evenimente", hu: "programpontok" },
        maxItems: 6,
        item: [
          { id: "time", label: LABELS.time, type: "time", maxLength: 5 },
          { id: "title", label: LABELS.title, type: "text", maxLength: 60 },
          { id: "note", label: LABELS.note, type: "text", maxLength: 100 },
          { id: "icon", label: LABELS.icon, type: "icon", maxLength: 20 },
        ],
      },
      fallback: [
        {
          values: {
            label: {
              en: "Friday · 17 Sep",
              ro: "Vineri · 17 sept.",
              hu: "Péntek · szept. 17.",
            },
          },
          items: [
            {
              time: "18:30",
              title: {
                en: "Welcome to the countryside",
                ro: "Bun venit la țară",
                hu: "Üdv a vidéken",
              },
              note: {
                en: "Drinks, dinner & a first toast at the villa",
                ro: "Băuturi, cină și primul toast la vilă",
                hu: "Italok, vacsora és az első koccintás a villában",
              },
              icon: "meal",
            },
          ],
        },
        {
          values: {
            label: {
              en: "Saturday · 18 Sep",
              ro: "Sâmbătă · 18 sept.",
              hu: "Szombat · szept. 18.",
            },
          },
          items: [
            {
              time: "15:30",
              title: {
                en: "The ceremony",
                ro: "Ceremonia",
                hu: "A szertartás",
              },
              note: {
                en: "Under the old oak tree, with you beside us",
                ro: "Sub stejarul bătrân, cu voi alături",
                hu: "Az öreg tölgyfa alatt, veletek az oldalunkon",
              },
              icon: "heart",
            },
            {
              time: "17:00",
              title: {
                en: "Aperitivo hour",
                ro: "Ora aperitivului",
                hu: "Aperitif",
              },
              note: {
                en: "Spritzes, little bites & the golden hour",
                ro: "Spritz, gustări și lumina de apus",
                hu: "Spritz, falatkák és az aranyóra",
              },
              icon: "sparkle",
            },
            {
              time: "19:00",
              title: {
                en: "Long-table dinner",
                ro: "Cina la masa lungă",
                hu: "Vacsora a hosszú asztalnál",
              },
              note: {
                en: "Toasts, handmade pasta & dancing under the stars",
                ro: "Toasturi, paste făcute în casă și dans sub stele",
                hu: "Pohárköszöntők, házi tészta és tánc a csillagok alatt",
              },
              icon: "moon",
            },
          ],
        },
        {
          values: {
            label: {
              en: "Sunday · 19 Sep",
              ro: "Duminică · 19 sept.",
              hu: "Vasárnap · szept. 19.",
            },
          },
          items: [
            {
              time: "10:00",
              title: {
                en: "One last slow morning",
                ro: "O ultimă dimineață fără grabă",
                hu: "Egy utolsó ráérős reggel",
              },
              note: {
                en: "Breakfast, coffee & a proper goodbye",
                ro: "Mic dejun, cafea și un rămas-bun cum se cuvine",
                hu: "Reggeli, kávé és egy rendes búcsú",
              },
              icon: "meal",
            },
          ],
        },
      ],
    },
  ],
};
