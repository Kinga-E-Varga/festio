import { RSVP_ANSWER_MAX } from "@/db/limits";
import type { Question, QuestionScope } from "@/db/schemas/event";
import { needsAnswerSchema } from "@/db/schemas/reply";
import type { AnswerValue } from "@/types/guests";

/** Answers by question id: missing = never asked, null = asked and skipped. */
export type Answers = Record<string, AnswerValue | null>;

/**
 * What a save holds answers to: whether archived questions still take
 * answers, and whether an answer that doesn't fit its question refuses the
 * save (`strict`) or is dropped as never asked.
 */
export interface AnswerRules {
  archived: boolean;
  strict: boolean;
}

/**
 * A guest's form: archived questions are no longer asked, and an answer the
 * host's change has made a misfit is dropped — the form may have opened
 * before that change, and one missing answer beats a lost reply.
 */
export const GUEST_RULES: AnswerRules = { archived: false, strict: false };

/** The host correcting a reply: still sees archived questions, and their page is never out of date. */
export const HOST_RULES: AnswerRules = { archived: true, strict: true };

/**
 * One reply's (or one person's) answers, checked against the event's
 * questions of that scope. An id that isn't one of them is dropped: a form
 * opened before the host changed the list. A key left out stays out (never
 * asked). Text is trimmed, empty is skipped. A wrong type, an option that
 * isn't the question's or too long a text refuses the whole save under
 * `rules.strict`, and is dropped otherwise. Required isn't held here: the
 * form holds it, and a form opened before the host turned it on never
 * showed it as required.
 */
export function checkAnswers(
  questions: Question[],
  scope: QuestionScope,
  sent: Answers | undefined,
  rules: AnswerRules,
): { ok: true; answers?: Answers } | { ok: false } {
  const answers: Answers = {};
  for (const question of questions) {
    if (question.scope !== scope || !sent || !(question.id in sent)) continue;
    if (question.archived && !rules.archived) continue;
    const value = answerFor(question, sent[question.id]);
    if (value === undefined && rules.strict) return { ok: false };
    if (value !== undefined) answers[question.id] = value;
  }
  return Object.keys(answers).length > 0
    ? { ok: true, answers }
    : { ok: true, answers: undefined };
}

/** The answer as stored, null if skipped, undefined if it doesn't fit the question. */
function answerFor(
  question: Question,
  value: AnswerValue | null,
): AnswerValue | null | undefined {
  if (value === null) return null;
  if (question.kind === "yesNo") {
    return typeof value === "boolean" ? value : undefined;
  }
  if (question.kind === "needs") return needsFor(question.options, value);
  if (typeof value !== "string") return undefined;
  if (question.kind === "choice") {
    return question.options.some(({ id }) => id === value) ? value : undefined;
  }
  const text = value.trim();
  if (text.length > RSVP_ANSWER_MAX) return undefined;
  return text === "" ? null : text;
}

/**
 * A needs answer as stored: each pick once, in the question's order; Other's
 * words trimmed and kept only when Other is picked and something is written.
 * Undefined if it isn't a needs answer, a pick isn't one of the question's
 * options or the words are too long.
 */
function needsFor(
  options: { id: string }[],
  value: AnswerValue,
): AnswerValue | undefined {
  const parsed = needsAnswerSchema.safeParse(value);
  if (!parsed.success) return undefined;
  const picked = new Set(parsed.data.needs);
  if (![...picked].every((pick) => options.some(({ id }) => id === pick))) {
    return undefined;
  }
  const needs = options.map(({ id }) => id).filter((id) => picked.has(id));
  const other = parsed.data.other?.trim() ?? "";
  if (other.length > RSVP_ANSWER_MAX) return undefined;
  const kept = picked.has("other") && other !== "";
  return { needs, ...(kept ? { other } : {}) };
}

/**
 * The questions with `answered` set on each one these answers answer (not
 * skipped); null when none is newly answered, so the save writes nothing
 * extra.
 */
export function markAnswered<Q extends { id: string; answered: boolean }>(
  questions: Q[],
  answers: (Answers | undefined)[],
): Q[] | null {
  const answered = new Set(
    answers.flatMap((each) =>
      Object.entries(each ?? {}).flatMap(([id, value]) =>
        value === null ? [] : [id],
      ),
    ),
  );
  if (!questions.some(({ id, answered: was }) => !was && answered.has(id))) {
    return null;
  }
  return questions.map((question) =>
    answered.has(question.id) ? { ...question, answered: true } : question,
  );
}
