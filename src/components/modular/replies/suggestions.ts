import type { QuestionScope } from "@/db/schemas/event";
import type { LocalizedText } from "@/lib/language";

/**
 * The questions offered as one-tap starters in the Replies tab. Tapping one
 * fills the add-question form with its wording in the invitation's
 * language; the host may change anything before adding, and once added it
 * is an ordinary question of theirs. `id` names its chip in the host's
 * language (`RepliesTab` messages, `suggestion.<id>`).
 */
export const SUGGESTIONS: {
  id: "transport" | "song" | "accessibility" | "accommodation" | "phone";
  label: Exclude<LocalizedText, string>;
  kind: "yesNo" | "text";
  scope: QuestionScope;
}[] = [
  {
    id: "transport",
    label: {
      en: "Do you need transport to the venue?",
      ro: "Ai nevoie de transport până la locație?",
      hu: "Szükséged van szállításra a helyszínig?",
    },
    kind: "yesNo",
    scope: "reply",
  },
  {
    id: "song",
    label: {
      en: "Which song gets you dancing?",
      ro: "Ce melodie te aduce pe ringul de dans?",
      hu: "Melyik dalra mész ki táncolni?",
    },
    kind: "text",
    scope: "reply",
  },
  {
    id: "accessibility",
    label: {
      en: "Any accessibility needs we should know about?",
      ro: "Ai nevoi de accesibilitate despre care ar trebui să știm?",
      hu: "Van olyan akadálymentességi igényed, amiről tudnunk kell?",
    },
    kind: "text",
    scope: "person",
  },
  {
    id: "accommodation",
    label: {
      en: "Do you need a place to stay?",
      ro: "Ai nevoie de cazare?",
      hu: "Szükséged van szállásra?",
    },
    kind: "yesNo",
    scope: "reply",
  },
  {
    id: "phone",
    label: {
      en: "A phone number, in case we need to reach you",
      ro: "Un număr de telefon, în caz că trebuie să te contactăm",
      hu: "Egy telefonszám, ha el kellene érnünk téged",
    },
    kind: "text",
    scope: "reply",
  },
];
