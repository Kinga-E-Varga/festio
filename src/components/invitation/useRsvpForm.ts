"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { pickDiet } from "@/components/dashboard/guest-list/labels";
import { newId } from "@/lib/id";
import type { Answers } from "@/lib/answers";
import type { Question } from "@/db/schemas/event";
import type { AgeGroup, AnswerValue, DietNeed, DietPick } from "@/types/guests";
import type { GuestPersonInput } from "@/db/schemas/reply";
import type { RsvpPayload, RsvpStatus } from "@/types/invitation";

interface RsvpRow {
  value: string;
  /** Empty = not answered yet. Asked only when the reply is Coming. */
  ageGroup: AgeGroup | "";
  diet: DietPick[];
  dietOther: string;
  /** The host's per-person questions; missing or null = not answered yet. */
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
export type RsvpProblem =
  "status" | "name" | "age" | "diet" | "dietOther" | "question";

const EMPTY_ROW: RsvpRow = {
  value: "",
  ageGroup: "",
  diet: [],
  dietOther: "",
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

/** A required question left blank, by anyone it is asked of. */
function requiredBlank(
  questions: Question[],
  answers: (Answers | undefined)[],
): boolean {
  return questions.some(
    (question) =>
      question.required && answers.some((each) => blank(each?.[question.id])),
  );
}

/**
 * Every question asked, as sent: each has a key (it was shown), text
 * trimmed, blank as null (asked and skipped). Undefined when none is asked.
 */
function sentAnswers(
  questions: Question[],
  answers: Answers | undefined,
): Answers | undefined {
  if (questions.length === 0) return undefined;
  return Object.fromEntries(
    questions.map((question): [string, AnswerValue | null] => {
      const value = answers?.[question.id];
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
  if (rows.some((row) => row.ageGroup === "")) return "age";
  if (rows.some((row) => row.diet.length === 0)) return "diet";
  /* Other alone tells the host nothing, so its words are asked for. */
  if (
    rows.some(
      (row) => row.diet.includes("other") && row.dietOther.trim() === "",
    )
  )
    return "dietOther";
  if (
    requiredBlank(
      asked.person,
      rows.map((row) => row.answers),
    ) ||
    requiredBlank(asked.shared, [shared])
  )
    return "question";
  return null;
}

/** One person's answers as sent: age, diet and the host's questions only for someone coming. */
function person(
  row: RsvpRow,
  status: RsvpStatus,
  questions: Question[],
): GuestPersonInput {
  const name = row.value.trim();
  if (status !== "going" || row.ageGroup === "") return { name };
  const needs = row.diet.filter((pick): pick is DietNeed => pick !== "none");
  const other = row.dietOther.trim();
  const answers = sentAnswers(questions, row.answers);
  return {
    name,
    ageGroup: row.ageGroup,
    diet: needs,
    ...(needs.includes("other") && other !== "" ? { dietOther: other } : {}),
    ...(answers && { answers }),
  };
}

/**
 * One reply, covering everyone the guest is answering for, with one going
 * choice for them all. `questions` are the host's own (archived ones are
 * not asked): each person's under their age and diet, the reply's once.
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

  function setAge(id: string, value: AgeGroup) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.ageGroup`, value);
  }

  function setDiet(id: string, pick: DietPick) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(
      `rows.${index}.diet`,
      pickDiet(getValues(`rows.${index}.diet`), pick),
    );
  }

  function setDietOther(id: string, value: string) {
    const index = indexOf(id);
    if (index === -1) return;
    setValue(`rows.${index}.dietOther`, value);
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
      status === "going" ? sentAnswers(asked.shared, shared) : undefined;
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
        ageGroup: rows[index]?.ageGroup ?? "",
        diet: rows[index]?.diet ?? [],
        dietOther: rows[index]?.dietOther ?? "",
        answers: rows[index]?.answers ?? {},
      })),
      status,
      note,
      shared,
    },
    questions: asked,
    set: {
      name: setName,
      age: setAge,
      diet: setDiet,
      dietOther: setDietOther,
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
