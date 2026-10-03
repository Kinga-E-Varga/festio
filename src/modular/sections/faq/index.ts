import { headingFields } from "@/modular/heading";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "faq",
  name: { en: "FAQ", ro: "Întrebări frecvente", hu: "GYIK" },
  required: false,
  order: 140,
  menuLabel: { en: "FAQ", ro: "Întrebări", hu: "GYIK" },
  fields: [
    ...headingFields({
      eyebrow: {
        en: "Wondering about something?",
        ro: "Te întrebi ceva?",
        hu: "Kérdésed van?",
      },
      heading: {
        en: "Good questions,",
        ro: "Întrebări bune,",
        hu: "Jó kérdések,",
      },
      headingItalic: { en: "good to know.", ro: "de știut.", hu: "jó tudni." },
      note: {
        en: "Still curious? Send us a note and we’ll help you plan.",
        ro: "Mai ai întrebări? Scrie-ne și te ajutăm să-ți faci planul.",
        hu: "Még kíváncsi vagy? Írj nekünk, és segítünk megtervezni.",
      },
    }),
    {
      id: "linkLabel",
      label: {
        en: "link to the reply form",
        ro: "linkul către formular",
        hu: "link a válaszűrlaphoz",
      },
      type: "text",
      maxLength: 60,
      fallback: {
        en: "Send us a note with your reply",
        ro: "Scrie-ne odată cu răspunsul",
        hu: "Írj nekünk a válaszoddal",
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
            en: "Can I bring a plus-one or my children?",
            ro: "Pot veni cu un însoțitor sau cu copiii?",
            hu: "Hozhatok kísérőt vagy a gyerekeimet?",
          },
          answer: {
            en: "We’ve kept a seat for everyone named on your invitation. Little ones are welcome — add them by name in your reply so we can make them comfortable.",
            ro: "Am păstrat câte un loc pentru fiecare persoană numită în invitație. Cei mici sunt bineveniți — adaugă-i pe nume în răspuns, ca să ne pregătim pentru ei.",
            hu: "Mindenkinek tartunk helyet, akinek a neve szerepel a meghívón. A kicsiket is szívesen látjuk — a válaszban add meg a nevüket, hogy felkészülhessünk rájuk.",
          },
        },
        {
          question: {
            en: "What should I wear for the ceremony?",
            ro: "Ce să port la ceremonie?",
            hu: "Mit vegyek fel a szertartásra?",
          },
          answer: {
            en: "The ceremony is on the lawn, so block heels or flats are your friends. We’d love you to dress up, but feel at ease.",
            ro: "Ceremonia e pe iarbă, așa că tocurile groase sau pantofii fără toc sunt cea mai bună alegere. Ne-ar plăcea să te îmbraci elegant, dar să te simți comod.",
            hu: "A szertartás a gyepen lesz, ezért a vastag sarok vagy a lapos cipő a barátod. Örülünk, ha kiöltözöl, de érezd jól magad.",
          },
        },
        {
          question: {
            en: "Will the celebration be outdoors?",
            ro: "Petrecerea va fi în aer liber?",
            hu: "A szabadban lesz az ünnepség?",
          },
          answer: {
            en: "We’re planning an outdoor ceremony and aperitivo, with dinner in the villa courtyard. A cozy indoor plan is ready if the weather has other ideas.",
            ro: "Plănuim ceremonia și aperitivul afară, iar cina în curtea vilei. Dacă vremea nu ține cu noi, avem pregătit un plan înăuntru.",
            hu: "A szertartást és az aperitifet a szabadban tervezzük, a vacsorát a villa udvarán. Ha az időjárás közbeszól, bent is felkészültünk.",
          },
        },
        {
          question: {
            en: "Can you accommodate dietary needs?",
            ro: "Puteți ține cont de nevoile alimentare?",
            hu: "Figyelembe tudjátok venni az étkezési igényeket?",
          },
          answer: {
            en: "Absolutely. Share any allergies or dietary needs in the reply form and our chef will take care of you.",
            ro: "Desigur. Spune-ne în formular dacă ai alergii sau nevoi alimentare, iar bucătarul va avea grijă de tine.",
            hu: "Természetesen. Az űrlapon jelezd az allergiádat vagy az étkezési igényeidet, és a séf gondoskodik rólad.",
          },
        },
        {
          question: {
            en: "When should I arrive?",
            ro: "Când ar trebui să ajung?",
            hu: "Mikor érkezzek?",
          },
          answer: {
            en: "Please arrive by 15:00 on Saturday so you have time to settle in before the ceremony begins at 15:30.",
            ro: "Te rugăm să ajungi până la 15:00 sâmbătă, ca să ai timp să te așezi înainte de ceremonia de la 15:30.",
            hu: "Kérünk, szombaton 15:00-ig érkezz, hogy legyen időd elhelyezkedni a 15:30-kor kezdődő szertartás előtt.",
          },
        },
      ],
    },
  ],
};
