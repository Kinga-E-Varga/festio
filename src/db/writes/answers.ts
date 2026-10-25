import type { Question, QuestionScope } from "@/db/schemas/event";
import { SaveRefused } from "@/db/writes/save";
import { checkAnswers, type AnswerRules, type Answers } from "@/lib/answers";

/**
 * A reply's (or a person's) answers as a save stores them, checked against
 * the event's questions under these rules (`checkAnswers`); a misfit the
 * rules don't drop refuses the save.
 */
export function checkedAnswers(
  questions: Question[],
  scope: QuestionScope,
  sent: Answers | undefined,
  rules: AnswerRules,
): Answers | undefined {
  const result = checkAnswers(questions, scope, sent, rules);
  if (!result.ok) throw new SaveRefused("invalid");
  return result.answers;
}
