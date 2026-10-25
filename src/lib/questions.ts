import { RSVP_OPTIONS_MAX } from "@/db/limits";
import type { Question, QuestionInput } from "@/db/schemas/event";

/**
 * The host's questions as sent, merged with the stored ones: the list the
 * save keeps. The host's order, wording and archive switches win. A
 * question a reply has answered (`answered`, which only the reply's save
 * sets) stays safe even if the editor was opened before that reply came:
 * left out, it is archived at the end instead of deleted; its type and
 * scope stay; Required can't go back on; its options can't go. Every such
 * question is named once in `kept`, so the host can be told.
 */
export function mergeQuestions(
  stored: Question[],
  sent: QuestionInput[],
): { questions: Question[]; kept: string[] } {
  const was = new Map(stored.map((question) => [question.id, question]));
  const kept = new Set<string>();
  const questions = sent.map((question): Question => {
    const before = was.get(question.id);
    if (!before?.answered) return { ...question, answered: false };
    const { merged, changed } = keepAnswered(before, question);
    if (changed) kept.add(question.id);
    return merged;
  });
  const sentIds = new Set(sent.map(({ id }) => id));
  for (const question of stored) {
    if (!question.answered || sentIds.has(question.id)) continue;
    questions.push({ ...question, archived: true });
    kept.add(question.id);
  }
  return { questions, kept: [...kept] };
}

/** A stored question as the editor holds and sends it: `answered` is the server's alone. */
export function inputOf(question: Question): QuestionInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { answered, ...input } = question;
  return input;
}

/** An answered question as the host sent it, with what can't change taken back from the stored one. */
function keepAnswered(
  before: Question,
  sent: QuestionInput,
): { merged: Question; changed: boolean } {
  const required = sent.required && before.required;
  let changed =
    sent.kind !== before.kind ||
    sent.scope !== before.scope ||
    required !== sent.required;
  const common = {
    id: before.id,
    label: sent.label,
    scope: before.scope,
    required,
    archived: sent.archived,
    answered: true,
  };
  if (before.kind !== "choice") {
    return { merged: { ...common, kind: before.kind }, changed };
  }
  const labels = sent.kind === "choice" ? sent.options : [];
  const sentIds = new Set(labels.map(({ id }) => id));
  const gone = before.options.filter(({ id }) => !sentIds.has(id));
  if (gone.length > 0) changed = true;
  /*
   * A new option is fine; one guests may have picked never goes. Brought
   * back past the limit, the host's newest options give way: a list the
   * save refuses would leave the invitation unsaveable.
   */
  const stored = new Set(before.options.map(({ id }) => id));
  const fitting = [...labels];
  let excess = fitting.length + gone.length - RSVP_OPTIONS_MAX;
  for (let index = fitting.length - 1; excess > 0 && index >= 0; index--) {
    if (stored.has(fitting[index].id)) continue;
    fitting.splice(index, 1);
    excess--;
  }
  const options = [...fitting, ...gone];
  return { merged: { ...common, kind: "choice", options }, changed };
}
