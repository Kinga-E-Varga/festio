import { useTranslations } from "next-intl";
import {
  ACCESS_KEY,
  AGE_KEY,
  DIET_KEY,
} from "@/components/dashboard/guest-list/labels";
import type { Question } from "@/db/schemas/event";

/** The suggested questions whose options the dashboard names in the host's language. */
const OPTION_KEYS: Record<string, Record<string, string>> = {
  age: AGE_KEY,
  diet: DIET_KEY,
  accessibility: ACCESS_KEY,
};

/**
 * A question's words in the host's language. The form shows a suggested
 * question in the invitation's language; the dashboard reads it in the
 * host's. A host's own question keeps the wording they wrote.
 */
export function useQuestionWords() {
  const tSuggested = useTranslations("Suggested");
  const t = useTranslations("GuestList");

  function title(question: Question): string {
    return "suggested" in question ? tSuggested(question.id) : question.label;
  }

  function option(question: Question, id: string): string {
    const keys = "suggested" in question ? OPTION_KEYS[question.id] : undefined;
    if (keys && Object.hasOwn(keys, id)) return t(keys[id]);
    if (question.kind !== "choice" && question.kind !== "needs") return id;
    return question.options.find((entry) => entry.id === id)?.label ?? id;
  }

  return { title, option };
}
