import { needsOf } from "@/lib/suggested";
import type { NeedsAnswer } from "@/db/schemas/reply";
import type {
  AnswerValue,
  GuestQuestion,
  GuestReply,
  NeedsValue,
  PersonValues,
  ReplyValues,
} from "@/types/guests";

/*
 * Between a stored reply and the reply editor's fields. Storage keeps the
 * spec's rule: missing = never asked, null = asked and skipped.
 */

export const personQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.scope === "person");
/** A needs question has its own field and answer shape; the rest are a value each. */
const plainQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.kind !== "needs");
const needsQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.kind === "needs");
export const sharedQuestions = (questions: GuestQuestion[]) =>
  questions.filter((question) => question.scope === "reply");

function answerIn(value: AnswerValue | null | undefined): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "boolean") return value ? "yes" : "no";
  return typeof value === "string" ? value : "";
}

function answersIn(
  reply: GuestReply | null,
  questions: GuestQuestion[],
): Record<string, string> {
  return Object.fromEntries(
    plainQuestions(questions).map((question) => [
      question.id,
      answerIn(reply?.answers?.[question.id]),
    ]),
  );
}

/** Left empty, a question never asked stays never asked; one that was asked reads as skipped. */
function unanswered<T>(
  before: T | null | undefined,
  asked: boolean,
): null | undefined {
  return before === undefined && !asked ? undefined : null;
}

function answerOut(
  question: GuestQuestion,
  value: string,
  before: AnswerValue | null | undefined,
  asked: boolean,
) {
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
    const next = answerOut(
      question,
      values[question.id] ?? "",
      before?.[question.id],
      asked,
    );
    if (next === undefined) delete out[question.id];
    else out[question.id] = next;
  }
  return before === undefined && Object.keys(out).length === 0
    ? undefined
    : out;
}

/** No needs is stored as an empty list; the editor shows it as None. */
function needsIn(answer: NeedsAnswer | null | undefined): NeedsValue {
  return {
    picks: !answer ? [] : answer.needs.length === 0 ? ["none"] : answer.needs,
    other: answer?.other ?? "",
  };
}

export function personValues(
  reply: GuestReply | null,
  questions: GuestQuestion[],
): PersonValues {
  return {
    name: reply?.name ?? "",
    needs: Object.fromEntries(
      needsQuestions(questions).map((question) => [
        question.id,
        needsIn(needsOf(reply?.answers, question.id)),
      ]),
    ),
    answers: answersIn(reply, personQuestions(questions)),
  };
}

/**
 * A saved reply as its editor opens it: everyone in it, one status, and the
 * reply-wide answers (each person holds a copy; the first one's is shown).
 */
export function replyValues(
  group: GuestReply[],
  questions: GuestQuestion[],
): ReplyValues {
  return {
    status: group[0].status,
    people: group.map((reply) => personValues(reply, questions)),
    shared: answersIn(group[0], sharedQuestions(questions)),
  };
}

export function newReplyValues(questions: GuestQuestion[]): ReplyValues {
  return {
    status: "going",
    people: [personValues(null, questions)],
    shared: answersIn(null, sharedQuestions(questions)),
  };
}

/** The picks as stored: `none` is an empty list, nothing picked is as unanswered as any other question. */
function needsOut(
  value: NeedsValue | undefined,
  before: ReturnType<typeof needsOf>,
  asked: boolean,
): NeedsAnswer | null | undefined {
  if (!value) return unanswered(before, asked);
  if (value.picks.includes("none")) return { needs: [] };
  const needs = value.picks;
  if (needs.length === 0) return unanswered(before, asked);
  const other = value.other.trim();
  return needs.includes("other") && other !== "" ? { needs, other } : { needs };
}

/** Not coming changes only the name and status: the answers stay stored, just not shown or counted. */
function applyPerson(
  reply: GuestReply,
  person: PersonValues,
  status: GuestReply["status"],
  questions: GuestQuestion[],
  asked: boolean,
): GuestReply {
  const base = { ...reply, name: person.name.trim(), status };
  if (status !== "going") return base;
  const answers = answersOut(
    plainQuestions(personQuestions(questions)),
    person.answers,
    reply.answers,
    asked,
  );
  const merged = { ...answers };
  for (const question of needsQuestions(questions)) {
    const next = needsOut(
      person.needs[question.id],
      needsOf(reply.answers, question.id),
      asked,
    );
    if (next === undefined) delete merged[question.id];
    else merged[question.id] = next;
  }
  return {
    ...base,
    answers:
      reply.answers === undefined && Object.keys(merged).length === 0
        ? undefined
        : merged,
  };
}

function applyShared(
  reply: GuestReply,
  shared: Record<string, string>,
  questions: GuestQuestion[],
  asked: boolean,
): GuestReply {
  return {
    ...reply,
    answers: answersOut(
      sharedQuestions(questions),
      shared,
      reply.answers,
      asked,
    ),
  };
}

/** Everyone in a new reply, sharing its id; every question counts as asked. */
export function newReplies(
  values: ReplyValues,
  questions: GuestQuestion[],
  ids: string[],
  repliedAt: string,
): GuestReply[] {
  return values.people.map((person, at) =>
    newPerson(values, person, questions, {
      id: ids[at],
      submissionId: ids[0],
      repliedAt,
    }),
  );
}

function newPerson(
  values: ReplyValues,
  person: PersonValues,
  questions: GuestQuestion[],
  card: Pick<GuestReply, "id" | "submissionId" | "repliedAt">,
): GuestReply {
  const blank: GuestReply = {
    ...card,
    name: "",
    status: values.status,
    note: null,
    differentPerson: false,
  };
  const filled = applyPerson(blank, person, values.status, questions, true);
  return values.status === "going"
    ? applyShared(filled, values.shared, questions, true)
    : filled;
}

/**
 * A saved reply's edit: `group` is its people in the editor's order, the
 * values' people after them are added to it (`newIds`). The status and the
 * reply-wide answers are the whole reply's. Someone switched to Coming is
 * asked like a new reply. People can't be removed here: they're separated
 * first, then deleted on their own.
 */
export function editReply(
  replies: GuestReply[],
  group: string[],
  values: ReplyValues,
  questions: GuestQuestion[],
  newIds: string[],
): GuestReply[] {
  const going = values.status === "going";
  const edited = replies.map((reply) => {
    const at = group.indexOf(reply.id);
    if (at === -1) return reply;
    const asked = reply.status !== "going" && going;
    const person = applyPerson(
      reply,
      values.people[at],
      values.status,
      questions,
      asked,
    );
    return going
      ? applyShared(person, values.shared, questions, asked)
      : person;
  });
  const first = replies.find((reply) => reply.id === group[0]);
  if (!first) return edited;
  /* Added people join the reply as if they had come with it. */
  const added = values.people.slice(group.length).map((person, at) =>
    newPerson(values, person, questions, {
      id: newIds[at],
      submissionId: first.submissionId,
      repliedAt: first.repliedAt,
    }),
  );
  return [...edited, ...added];
}
