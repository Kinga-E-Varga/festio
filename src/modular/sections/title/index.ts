import { LABELS } from "@/modular/labels";
import type { SectionDefinition } from "@/types/modular";

export const section: SectionDefinition = {
  id: "title",
  name: { en: "Title", ro: "Titlu", hu: "Cím" },
  required: true,
  order: 20,
  menuLabel: { en: "Details", ro: "Detalii", hu: "Részletek" },
  fields: [
    {
      id: "heading",
      label: LABELS.heading,
      type: "longText",
      maxLength: 120,
      fallback: {
        en: "We would love for you to stand with us on the day we say yes.",
        ro: "Ne-ar bucura să fii alături de noi în ziua în care spunem „da”.",
        hu: "Örülnénk, ha velünk lennél azon a napon, amikor kimondjuk az igent.",
      },
    },
    {
      id: "body",
      label: {
        en: "your own words",
        ro: "cuvintele voastre",
        hu: "a saját szavaitok",
      },
      type: "longText",
      maxLength: 600,
      fallback: {
        en: "We met on a rainy Tuesday in Cluj and have been arguing about the best way home ever since. Ten years on, we are making it official — and the day would not be the same without you.",
        ro: "Ne-am cunoscut într-o marți ploioasă la Cluj și de atunci ne tot certăm care e cel mai bun drum spre casă. După zece ani, facem pasul — și ziua n-ar fi la fel fără tine.",
        hu: "Egy esős kedden ismerkedtünk meg Kolozsváron, és azóta is azon vitatkozunk, merre a legrövidebb az út hazafelé. Tíz év után hivatalossá tesszük — és ez a nap nem lenne ugyanaz nélküled.",
      },
    },
  ],
};
