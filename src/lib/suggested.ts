import type {
  Question,
  QuestionScope,
  StoredQuestion,
  SuggestedId,
} from "@/db/schemas/event";
import {
  ageGroupSchema,
  needsAnswerSchema,
  type Answer,
  type NeedsAnswer,
} from "@/db/schemas/reply";
import { localized, type Language, type LocalizedText } from "@/lib/language";
import type { AccessNeed, AgeGroup, DietNeed } from "@/types/guests";

type Words = Exclude<LocalizedText, string>;

const AGE_OPTIONS: Record<AgeGroup, Words> = {
  adult: { en: "Adult", ro: "Adult", hu: "Felnőtt" },
  child: { en: "Child", ro: "Copil", hu: "Gyerek" },
  baby: { en: "Baby", ro: "Bebeluș", hu: "Baba" },
};

const DIET_OPTIONS: Record<DietNeed, Words> = {
  vegetarian: {
    en: "Vegetarian",
    ro: "Vegetarian",
    hu: "Vegetáriánus",
  },
  vegan: { en: "Vegan", ro: "Vegan", hu: "Vegán" },
  glutenFree: {
    en: "Gluten-free",
    ro: "Fără gluten",
    hu: "Gluténmentes",
  },
  lactoseFree: {
    en: "Lactose-free",
    ro: "Fără lactoză",
    hu: "Laktózmentes",
  },
  nutAllergy: {
    en: "Nut allergy",
    ro: "Alergie la nuci",
    hu: "Dióallergia",
  },
  other: { en: "Other", ro: "Altele", hu: "Egyéb" },
};

const ACCESS_OPTIONS: Record<AccessNeed, Words> = {
  stepFree: { en: "Wheelchair", ro: "Scaun cu rotile", hu: "Kerekesszék" },
  walking: { en: "Walking help", ro: "Ajutor la mers", hu: "Járássegítés" },
  hearing: { en: "Hard of hearing", ro: "Auz slab", hu: "Nagyothalló" },
  sight: { en: "Low vision", ro: "Vedere slabă", hu: "Gyengénlátó" },
  other: { en: "Other", ro: "Altele", hu: "Egyéb" },
};

/**
 * Our own questions, which every event may keep, switch off or ask. The card
 * stores only the switches (`StoredQuestion`); the kind, scope and wording
 * live here, so a wording fix reaches every event. Age and diet are the
 * ones every new event starts with.
 */
export const SUGGESTED: Record<
  SuggestedId,
  {
    kind: "choice" | "yesNo" | "text" | "needs";
    scope: QuestionScope;
    label: Words;
    /** A needs question's options must include `other`: it opens the text box. */
    options?: Record<string, Words>;
  }
> = {
  age: {
    kind: "choice",
    scope: "person",
    label: { en: "Age", ro: "Vârstă", hu: "Életkor" },
    options: AGE_OPTIONS,
  },
  diet: {
    kind: "needs",
    scope: "person",
    label: {
      en: "Dietary needs",
      ro: "Restricții alimentare",
      hu: "Étrendi igények",
    },
    options: DIET_OPTIONS,
  },
  transport: {
    kind: "yesNo",
    scope: "reply",
    label: {
      en: "Do you need transport to the venue?",
      ro: "Ai nevoie de transport până la locație?",
      hu: "Szükséged van szállításra a helyszínig?",
    },
  },
  song: {
    kind: "text",
    scope: "reply",
    label: {
      en: "Which song gets you dancing?",
      ro: "Ce melodie te aduce pe ringul de dans?",
      hu: "Melyik dalra mész ki táncolni?",
    },
  },
  accessibility: {
    kind: "needs",
    scope: "person",
    label: {
      en: "Any accessibility needs we should know about?",
      ro: "Ai nevoi de accesibilitate despre care ar trebui să știm?",
      hu: "Van olyan akadálymentességi igényed, amiről tudnunk kell?",
    },
    options: ACCESS_OPTIONS,
  },
  accommodation: {
    kind: "yesNo",
    scope: "reply",
    label: {
      en: "Do you need a place to stay?",
      ro: "Ai nevoie de cazare?",
      hu: "Szükséged van szállásra?",
    },
  },
  phone: {
    kind: "text",
    scope: "reply",
    label: {
      en: "A phone number, in case we need to reach you",
      ro: "Un număr de telefon, în caz că trebuie să te contactăm",
      hu: "Egy telefonszám, ha el kellene érnünk téged",
    },
  },
};

/** What a new event's form asks: age, then diet, both required. */
export const DEFAULT_QUESTIONS: StoredQuestion[] = [
  {
    id: "age",
    suggested: true,
    required: true,
    archived: false,
    answered: false,
  },
  {
    id: "diet",
    suggested: true,
    required: true,
    archived: false,
    answered: false,
  },
];

function optionsOf(
  options: Record<string, Words> | undefined,
  language: Language,
): { id: string; label: string }[] {
  return Object.entries(options ?? {}).map(([id, words]) => ({
    id,
    label: localized(words, language),
  }));
}

/**
 * The card's questions as the rest of the code reads them: a host's own
 * unchanged, a suggested one filled in from `SUGGESTED` in the invitation's
 * language. The order is kept.
 */
export function resolveQuestions(
  stored: StoredQuestion[],
  language: Language,
): Question[] {
  return stored.map((card): Question => {
    if (!("suggested" in card)) return card;
    const { kind, scope, label, options } = SUGGESTED[card.id];
    const common = {
      id: card.id,
      suggested: true as const,
      scope,
      label: localized(label, language),
      required: card.required,
      archived: card.archived,
      answered: card.answered,
    };
    switch (kind) {
      case "choice":
      case "needs":
        return { ...common, kind, options: optionsOf(options, language) };
      default:
        return { ...common, kind };
    }
  });
}

type Answers = Record<string, Answer> | undefined;

/** A person's age answer; a value that isn't an age group reads as never asked. */
export function ageOf(answers: Answers): AgeGroup | null | undefined {
  const value = answers?.age;
  if (value === null) return null;
  const parsed = ageGroupSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

/** A person's answer to a needs question; a value of any other shape reads as never asked. */
export function needsOf(
  answers: Answers,
  id: string,
): NeedsAnswer | null | undefined {
  const value = answers?.[id];
  if (value === null) return null;
  const parsed = needsAnswerSchema.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

/** A person's diet answer. */
export function dietOf(answers: Answers): NeedsAnswer | null | undefined {
  return needsOf(answers, "diet");
}

/** A person's accessibility answer. */
export function accessOf(answers: Answers): NeedsAnswer | null | undefined {
  return needsOf(answers, "accessibility");
}
