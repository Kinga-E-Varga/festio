import { expect, test } from "vitest";
import type {
  CustomQuestion,
  QuestionInput,
  StoredQuestion,
} from "@/db/schemas/event";
import { inputOf, mergeQuestions } from "@/lib/questions";

/* Every expected list is worked out by hand from the spec's rules and these three questions. */

const A: CustomQuestion = {
  id: "a",
  label: "Transport?",
  scope: "reply",
  kind: "yesNo",
  required: false,
  archived: false,
  answered: true,
};

const B: CustomQuestion = {
  id: "b",
  label: "Song",
  scope: "reply",
  kind: "text",
  required: false,
  archived: false,
  answered: false,
};

const C: CustomQuestion = {
  id: "c",
  label: "Meal",
  scope: "person",
  kind: "choice",
  options: [
    { id: "o1", label: "Fish" },
    { id: "o2", label: "Beef" },
  ],
  required: true,
  archived: false,
  answered: true,
};

/** A stored question as the editor sends it back: no `answered`. */
const input = (question: CustomQuestion) =>
  inputOf(question) as Extract<QuestionInput, { kind: string }>;

const ids = (list: StoredQuestion[]) => list.map(({ id }) => id);
const byId = (list: StoredQuestion[], id: string) =>
  list.find((question) => question.id === id);

test("a question nobody answered is deleted when left out", () => {
  const result = mergeQuestions([A, B, C], [input(A), input(C)]);
  expect(ids(result.questions)).toEqual(["a", "c"]);
  expect(result.kept).toEqual([]);
});

test("an answered question left out is kept, archived, at the end", () => {
  const result = mergeQuestions([A, B, C], [input(B), input(C)]);
  expect(ids(result.questions)).toEqual(["b", "c", "a"]);
  expect(byId(result.questions, "a")?.archived).toBe(true);
  expect(result.kept).toEqual(["a"]);
});

test("an answered question keeps its type and scope", () => {
  const sent = {
    ...input(A),
    kind: "text",
    scope: "person",
    label: "Ride?",
  } as QuestionInput;
  const result = mergeQuestions([A], [sent]);
  expect(result.questions[0]).toMatchObject({
    kind: "yesNo",
    scope: "reply",
    label: "Ride?",
  });
  expect(result.kept).toEqual(["a"]);
});

test("rewording an answered question changes nothing else", () => {
  const result = mergeQuestions([A], [{ ...input(A), label: "Need a ride?" }]);
  expect((result.questions[0] as CustomQuestion).label).toBe("Need a ride?");
  expect(result.kept).toEqual([]);
});

test("Required turns off, but not on, once answered", () => {
  const on = mergeQuestions([A], [{ ...input(A), required: true }]);
  expect(on.questions[0].required).toBe(false);
  expect(on.kept).toEqual(["a"]);

  const off = mergeQuestions([C], [{ ...input(C), required: false }]);
  expect(off.questions[0].required).toBe(false);
  expect(off.kept).toEqual([]);
});

test("an answered choice keeps its options", () => {
  const sent = {
    ...input(C),
    options: [
      { id: "o1", label: "Fish fillet" },
      { id: "o3", label: "Pasta" },
    ],
  } as QuestionInput;
  const result = mergeQuestions([C], [sent]);
  expect(result.questions[0]).toMatchObject({
    options: [
      { id: "o1", label: "Fish fillet" },
      { id: "o3", label: "Pasta" },
      { id: "o2", label: "Beef" },
    ],
  });
  expect(result.kept).toEqual(["c"]);
});

test("an answered choice never grows past 8 options", () => {
  /* The host removed Beef and added seven, not knowing a guest had answered: Beef comes back, the last new one gives way. */
  const added = Array.from({ length: 7 }, (_, index) => ({
    id: `n${index + 1}`,
    label: `New ${index + 1}`,
  }));
  const sent = {
    ...input(C),
    options: [{ id: "o1", label: "Fish" }, ...added],
  } as QuestionInput;
  const result = mergeQuestions([C], [sent]);
  const [first] = result.questions as CustomQuestion[];
  const options = first.kind === "choice" ? first.options : [];
  expect(options.map(({ id }) => id)).toEqual([
    "o1",
    "n1",
    "n2",
    "n3",
    "n4",
    "n5",
    "n6",
    "o2",
  ]);
  expect(result.kept).toEqual(["c"]);
});

test("a question nobody answered can change type", () => {
  const sent = { ...input(B), kind: "yesNo" } as QuestionInput;
  const result = mergeQuestions([B], [sent]);
  expect((result.questions[0] as CustomQuestion).kind).toBe("yesNo");
  expect(result.kept).toEqual([]);
});

test("answered stays with the stored question", () => {
  const d: QuestionInput = { ...input(B), id: "d" };
  const result = mergeQuestions([A], [input(A), d]);
  expect(byId(result.questions, "a")?.answered).toBe(true);
  expect(byId(result.questions, "d")?.answered).toBe(false);
});

test("the order is the host's", () => {
  const result = mergeQuestions([A, B, C], [input(C), input(A), input(B)]);
  expect(ids(result.questions)).toEqual(["c", "a", "b"]);
});

test("archive and restore are the host's", () => {
  const archived = mergeQuestions([A], [{ ...input(A), archived: true }]);
  expect(archived.questions[0].archived).toBe(true);
  expect(archived.kept).toEqual([]);

  const restored = mergeQuestions(
    [{ ...A, archived: true }],
    [{ ...input(A), archived: false }],
  );
  expect(restored.questions[0].archived).toBe(false);
});

test("one question kept for two reasons is named once", () => {
  const sent = { ...input(A), kind: "text", required: true } as QuestionInput;
  expect(mergeQuestions([A], [sent]).kept).toEqual(["a"]);
});

const AGE_CARD = {
  id: "age",
  suggested: true,
  required: true,
  archived: false,
  answered: true,
} as const;

test("an answered suggested question can turn Required off", () => {
  expect(
    mergeQuestions([AGE_CARD], [{ ...inputOf(AGE_CARD), required: false }]),
  ).toEqual({
    questions: [{ ...AGE_CARD, required: false }],
    kept: [],
  });
});

test("an answered suggested question can't turn Required back on", () => {
  const off = { ...AGE_CARD, required: false };
  expect(mergeQuestions([off], [{ ...inputOf(off), required: true }])).toEqual({
    questions: [off],
    kept: ["age"],
  });
});

test("an answered suggested question left out is archived", () => {
  expect(mergeQuestions([AGE_CARD], [])).toEqual({
    questions: [{ ...AGE_CARD, archived: true }],
    kept: ["age"],
  });
});

test("an unanswered suggested question left out is gone", () => {
  expect(mergeQuestions([{ ...AGE_CARD, answered: false }], [])).toEqual({
    questions: [],
    kept: [],
  });
});

test("archived suggested sent again un-archives", () => {
  const archived = { ...AGE_CARD, archived: true };
  expect(
    mergeQuestions([archived], [{ ...inputOf(archived), archived: false }]),
  ).toEqual({
    questions: [{ ...AGE_CARD, archived: false }],
    kept: [],
  });
});
