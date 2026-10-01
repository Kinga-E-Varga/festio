import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "faq",
  name: { en: "FAQ", ro: "Întrebări frecvente", hu: "GYIK" },
  required: false,
  order: 140,
  menuLabel: { en: "FAQ", ro: "Întrebări", hu: "GYIK" },
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Questions we have been asked",
        ro: "Întrebări primite",
        hu: "Kérdések, amiket kaptunk",
      },
    },
    {
      id: "items",
      label: { en: "questions", ro: "întrebări", hu: "kérdések" },
      type: "list",
      maxItems: 12,
      item: [
        {
          id: "question",
          label: { en: "question", ro: "întrebare", hu: "kérdés" },
          type: "text",
          maxLength: 120,
        },
        {
          id: "answer",
          label: { en: "answer", ro: "răspuns", hu: "válasz" },
          type: "longText",
          maxLength: 400,
        },
      ],
      fallback: [
        {
          question: {
            en: "Can I bring the children?",
            ro: "Pot veni cu copiii?",
            hu: "Hozhatom a gyerekeket?",
          },
          answer: {
            en: "Yes. Add each child by name in your reply and pick their age group, so the kitchen and the seating plan know.",
            ro: "Da. Adaugă fiecare copil pe nume în răspuns și alege grupa de vârstă, ca bucătăria și planul meselor să știe.",
            hu: "Igen. A válaszban add meg minden gyerek nevét és korosztályát, hogy a konyha és az ültetési rend is tudjon róla.",
          },
        },
        {
          question: {
            en: "Can I change my answer later?",
            ro: "Îmi pot schimba răspunsul mai târziu?",
            hu: "Módosíthatom később a válaszom?",
          },
          answer: {
            en: "Write to us and we will correct it. Only we can edit a reply once it is in.",
            ro: "Scrie-ne și îl corectăm noi. Doar noi putem modifica un răspuns după ce a fost trimis.",
            hu: "Írj nekünk, és kijavítjuk. Beküldés után csak mi módosíthatjuk a választ.",
          },
        },
        {
          question: {
            en: "Is the ceremony outdoors?",
            ro: "Ceremonia e în aer liber?",
            hu: "A szabadban lesz a szertartás?",
          },
          answer: {
            en: "Yes, in the walled garden, with the orangery as the wet-weather plan.",
            ro: "Da, în grădina cu ziduri; dacă plouă, ne mutăm în oranjerie.",
            hu: "Igen, a fallal körülvett kertben; eső esetén az üvegházba költözünk.",
          },
        },
        {
          question: {
            en: "Until when can I reply?",
            ro: "Până când pot răspunde?",
            hu: "Meddig válaszolhatok?",
          },
          answer: {
            en: "The form closes on its own the day before the wedding.",
            ro: "Formularul se închide singur cu o zi înainte de nuntă.",
            hu: "Az űrlap az esküvő előtti napon magától lezárul.",
          },
        },
      ],
    },
  ],
};
