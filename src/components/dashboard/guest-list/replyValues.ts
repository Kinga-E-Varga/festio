import type {
  AnswerValue,
  DietNeed,
  GuestQuestion,
  GuestReply,
  PersonValues,
  ReplyValues,
} from "@/types/guests";

/*
 * Between a stored reply and the reply editor's fields. Storage keeps the
 * spec's rule: missing = never asked, null = asked and skipped.
 */

/** The longest text answer, and the longest Other diet. */
export const ANSWER_LIMIT = 200;

export const personQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.scope === "person");
export const sharedQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.scope === "reply");

function answerIn(value: AnswerValue | null | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "yes" : "no";
  return value;
}

function answersIn(reply: GuestReply | null, questions: GuestQuestion[]): Record<string, string> {
  return Object.fromEntries(questions.map((question) => [question.id, answerIn(reply?.answers?.[question.id])]));
}

/** Left empty, a question never asked stays never asked; one that was asked reads as skipped. */
function unanswered<T>(before: T | null | undefined, asked: boolean): null | undefined {
  return before === undefined && !asked ? undefined : null;
}

function answerOut(question: GuestQuestion, value: string, before: AnswerValue | null | undefined, asked: boolean) {
  const text = value.trim();
  if (text === "") return unanswered(before, asked);
  return question.kind === "yesNo" ? text === "yes" : text;
}

/** Merged into the answers already stored, so other questions' answers stay as they are. */
function answersOut(
  questions: GuestQuestion[],
  values: Record<string, string>,
  before: GuestReply["answers"],
  asked: boolean,
): GuestReply["answers"] {
  const out: Record<string, AnswerValue | null> = { ...before };
  for (const question of questions) {
    const next = answerOut(question, values[question.id] ?? "", before?.[question.id], asked);
    if (next === undefined) delete out[question.id];
    else out[question.id] = next;
  }
  return before === undefined && Object.keys(out).length === 0 ? undefined : out;
}

export function personValues(reply: GuestReply | null, questions: GuestQuestion[]): PersonValues {
  const diet = reply?.diet;
  return {
    name: reply?.name ?? "",
    ageGroup: reply?.ageGroup ?? "",
    /* No needs is stored as an empty list; the editor shows it as None. */
    diet: diet === undefined || diet === null ? [] : diet.length === 0 ? ["none"] : diet,
    dietOther: reply?.dietOther ?? "",
    answers: answersIn(reply, personQuestions(questions)),
  };
}

/** One person's reply, as their row's editor opens it. */
export function replyValues(reply: GuestReply, questions: GuestQuestion[]): ReplyValues {
  return {
    status: reply.status,
    people: [personValues(reply, questions)],
    shared: answersIn(reply, sharedQuestions(questions)),
    separate: false,
  };
}

export function newReplyValues(questions: GuestQuestion[]): ReplyValues {
  return {
    status: "going",
    people: [personValues(null, questions)],
    shared: answersIn(null, sharedQuestions(questions)),
    separate: false,
  };
}

/** Not coming changes only the name and status: the answers stay stored, just not shown or counted. */
function applyPerson(reply: GuestReply, person: PersonValues, status: GuestReply["status"], questions: GuestQuestion[], asked: boolean): GuestReply {
  const base = { ...reply, name: person.name.trim(), status };
  if (status !== "going") return base;
  const needs = person.diet.filter((pick): pick is DietNeed => pick !== "none");
  const other = person.dietOther.trim();
  return {
    ...base,
    ageGroup: person.ageGroup === "" ? unanswered(reply.ageGroup, asked) : person.ageGroup,
    diet: person.diet.includes("none") ? [] : needs.length > 0 ? needs : unanswered(reply.diet, asked),
    dietOther: needs.includes("other") && other !== "" ? other : undefined,
    answers: answersOut(personQuestions(questions), person.answers, reply.answers, asked),
  };
}

function applyShared(reply: GuestReply, shared: Record<string, string>, questions: GuestQuestion[], asked: boolean): GuestReply {
  return { ...reply, answers: answersOut(sharedQuestions(questions), shared, reply.answers, asked) };
}

/** Everyone in a new reply, sharing its id; every question counts as asked. */
export function newReplies(values: ReplyValues, questions: GuestQuestion[], ids: string[], repliedAt: string): GuestReply[] {
  return values.people.map((person, at) => {
    const blank: GuestReply = {
      id: ids[at],
      submissionId: ids[0],
      name: "",
      status: values.status,
      note: null,
      repliedAt,
      differentPerson: false,
    };
    const filled = applyPerson(blank, person, values.status, questions, true);
    return values.status === "going" ? applyShared(filled, values.shared, questions, true) : filled;
  });
}

/**
 * One person's edit. The reply-wide answers change for everyone who replied
 * with them. Switched to Coming, the person is asked like a new reply.
 *
 * Separated, the person moves to a reply of their own (`ownId`): they keep
 * their copy of the reply-wide answers, the others keep theirs, and the
 * message stays with the others, so it shows and counts once.
 */
export function editReply(
  replies: GuestReply[],
  id: string,
  values: ReplyValues,
  questions: GuestQuestion[],
  ownId: string,
): GuestReply[] {
  const target = replies.find((reply) => reply.id === id);
  if (!target) return replies;
  const going = values.status === "going";
  const asked = target.status !== "going" && going;
  return replies.map((reply) => {
    if (reply.id === id) {
      const edited = applyPerson(reply, values.people[0], values.status, questions, asked);
      const moved = values.separate ? { ...edited, submissionId: ownId, note: null } : edited;
      return going ? applyShared(moved, values.shared, questions, asked) : moved;
    }
    if (going && !values.separate && reply.submissionId === target.submissionId) {
      return applyShared(reply, values.shared, questions, false);
    }
    return reply;
  });
}
