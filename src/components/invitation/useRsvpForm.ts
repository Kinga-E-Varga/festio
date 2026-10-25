"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { pickNeeds } from "@/components/dashboard/guest-list/labels";
import { newId } from "@/lib/id";
import type { Answers } from "@/lib/answers";
import type { Question } from "@/db/schemas/event";
import type { AnswerValue, NeedsPick, NeedsValue } from "@/types/guests";
import type { GuestPersonInput } from "@/db/schemas/reply";
import type { RsvpPayload, RsvpStatus } from "@/types/invitation";

interface RsvpRow {
  value: string;
  /** Each needs question's picks by question id; none picked = not answered yet, None counts as an answer. */
  needs: Record<string, NeedsValue>;
  /** The other per-person questions, age included; missing or null = not answered yet. */
  answers: Answers;
}

interface RsvpFieldValues {
  rows: RsvpRow[];
  status: RsvpStatus | null;
  note: string;
  /** The host's once-per-reply questions. */
  shared: Answers;
}

/** What stops the reply from being sent, first one only, in the order the form reads. */
export type RsvpProblem = "status" | "name" | "needsOther" | "question";

const EMPTY_ROW: RsvpRow = {
  value: "",
  needs: {},
  answers: {},
};

/** Not answered: never touched, unpicked, or only spaces. */
function blank(
  value: AnswerValue | null | undefined,
): value is "" | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

/** A needs question's answer as sent: None is no needs, nothing picked is skipped. */
function sentNeeds(value: NeedsValue | undefined): AnswerValue | null {
  if (!value || value.picks.length === 0) return null;
  const needs = value.picks.filter((pick) => pick !== "none");
  const other = value.other.trim();
  return {
    needs,
    ...(needs.includes("other") && other !== "" ? { other } : {}),
  };
}

/** A person's answer to one question as sent: text trimmed, blank as null (asked and skipped). */
function sentValue(question: Question, row: RsvpRow): AnswerValue | null {
  if (question.kind === "needs") return sentNeeds(row.needs[question.id]);
  const value = row.answers[question.id];
  if (blank(value)) return null;
  return typeof value === "string" ? value.trim() : value;
}

/** A required question left blank, by anyone it is asked of. */
function requiredBlank(questions: Question[], rows: RsvpRow[]): boolean {
  return questions.some(
    (question) =>
      question.required && rows.some((row) => blank(sentValue(question, row))),
  );
}

/** A reply-wide question left blank. */
function sharedBlank(questions: Question[], shared: Answers): boolean {
  return questions.some(
    (question) => question.required && blank(shared[question.id]),
  );
}

/**
 * The reply's own answers as sent: every question asked has a key (it was
 * shown), text trimmed, blank as null (asked and skipped). Undefined when
 * none is asked.
 */
function sentShared(
  questions: Question[],
  answers: Answers,
): Answers | undefined {
  if (questions.length === 0) return undefined;
  return Object.fromEntries(
    questions.map((question): [string, AnswerValue | null] => {
      const value = answers[question.id];
      if (blank(value)) return [question.id, null];
      return [question.id, typeof value === "string" ? value.trim() : value];
    }),
  );
}

/** The first thing still missing, in the order the form reads; null once the reply can go. */
function firstProblem(
  rows: RsvpRow[],
  status: RsvpStatus | null,
  asked: { person: Question[]; shared: Question[] },
  shared: Answers,
): RsvpProblem | null {
  if (status === null) return "status";
  if (rows.some((row) => row.value.trim() === "")) return "name";
  if (status !== "going") return null;
  /* Other alone tells the host nothing, so its words are asked for. */
  if (
    rows.some((row) =>
      asked.person.some((question) => {
        const value = row.needs[question.id];
        return (
          question.kind === "needs" &&
          value?.picks.includes("other") &&
          value.other.trim() === ""
        );
      }),
    )
  )
    return "needsOther";
  if (requiredBlank(asked.person, rows) || sharedBlank(asked.shared, shared))
    return "question";
  return null;
}

/** One person's answers as sent: the questions asked, only for someone coming. */
function person(
  row: RsvpRow,
  status: RsvpStatus,
  questions: Question[],
): GuestPersonInput {
  const name = row.value.trim();
  if (status !== "going" || questions.length === 0) return { name };
  return {
    name,
    answers: Object.fromEntries(
      questions.map((question): [string, AnswerValue | null] => [
        question.id,
        sentValue(question, row),
      ]),
    ),
  };
}

/**
 * One reply, covering everyone the guest is answering for, with one going
 * choice for them all. `questions` are the host's, resolved (archived ones
 * are not asked): each person's under their name, the reply's once.
 */
export function useRsvpForm(questions: Question[] = []) {
  const { control, setValue, getValues } = useForm<RsvpFieldValues>({
    defaultValues: { rows: [EMPTY_ROW], status: null, note: "", shared: {} },
  });
  const active = questions.filter((question) => !question.archived);
  const asked = {
    person: active.filter((question) => question.scope === "person"),
    shared: active.filter((question) => question.scope === "reply"),
  };
  const { fields, append, remove } = useFieldArray({ control, name: "rows" });
  const [sent, setSent] = useState(false);
  /* One ID for this reply, however many times Send is tried: it's saved once. */
  const [replyId] = useState(newId);

  const rows = useWatch({ control, name: "rows" });
  const status = useWatch({ control, name: "status" });
  const note = useWatch({ control, name: "note" });
  const shared = useWatch({ control, name: "shared" });

  const going = status === "going";
  const problem = firstProblem(rows, status, asked, shared);

  function indexOf(id: string) {
    return fields.findIndex((field) => field.id === id);
  }

  function setName(id: string, value: string) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.value`, value);
  }

  function setNeeds(id: string, question: string, pick: NeedsPick) {
    const index = indexOf(id);
    if (index === -1) return;
    const needs = getValues(`rows.${index}.needs`);
    const now = needs[question] ?? { picks: [], other: "" };
    setValue(`rows.${index}.needs`, {
      ...needs,
      [question]: { ...now, picks: pickNeeds(now.picks, pick) },
    });
  }

  function setNeedsOther(id: string, question: string, other: string) {
    const index = indexOf(id);
    if (index === -1) return;
    const needs = getValues(`rows.${index}.needs`);
    const now = needs[question] ?? { picks: [], other: "" };
    setValue(`rows.${index}.needs`, {
      ...needs,
      [question]: { ...now, other },
    });
  }

  function setAnswer(id: string, question: string, value: AnswerValue | null) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.answers`, {
      ...getValues(`rows.${index}.answers`),
      [question]: value,
    });
  }

  function setShared(question: string, value: AnswerValue | null) {
    setValue("shared", { ...getValues("shared"), [question]: value });
  }

  function addName() {
    append(EMPTY_ROW);
  }

  function removeName(id: string) {
    const index = indexOf(id);
    if (index === -1) return;
    remove(index);
  }

  /** Null until the reply is answerable, so callers cannot send a half one. */
  function buildPayload(): RsvpPayload | null {
    if (problem !== null || status === null) return null;
    const trimmed = note.trim();
    const answers =
      status === "going" ? sentShared(asked.shared, shared) : undefined;
    return {
      id: replyId,
      status,
      message: trimmed === "" ? null : trimmed,
      ...(answers && { answers }),
      people: rows.map((row) => person(row, status, asked.person)),
    };
  }

  return {
    values: {
      rows: fields.map((field, index) => ({
        id: field.id,
        value: rows[index]?.value ?? "",
        needs: rows[index]?.needs ?? {},
        answers: rows[index]?.answers ?? {},
      })),
      status,
      note,
      shared,
    },
    questions: asked,
    set: {
      name: setName,
      needs: setNeeds,
      needsOther: setNeedsOther,
      answer: setAnswer,
      sharedAnswer: setShared,
      addName,
      removeName,
      status: (value: RsvpStatus) => setValue("status", value),
      note: (value: string) => setValue("note", value),
    },
    derived: {
      going,
      problem,
      sent,
    },
    buildPayload,
    markSent: () => setSent(true),
  };
}

export type RsvpFormState = ReturnType<typeof useRsvpForm>;
