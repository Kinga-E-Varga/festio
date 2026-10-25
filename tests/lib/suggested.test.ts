import { expect, test } from "vitest";
import type { CustomQuestion } from "@/db/schemas/event";
import {
  ageOf,
  DEFAULT_QUESTIONS,
  accessOf,
  dietOf,
  resolveQuestions,
  SUGGESTED,
} from "@/lib/suggested";

const MEAL: CustomQuestion = {
  id: "meal",
  label: "Meal",
  scope: "person",
  kind: "text",
  required: false,
  archived: false,
  answered: false,
};

test("resolves a suggested card in the invitation's language", () => {
  expect(
    resolveQuestions(
      [
        {
          id: "transport",
          suggested: true,
          required: false,
          archived: false,
          answered: false,
        },
      ],
      "ro",
    ),
  ).toEqual([
    {
      id: "transport",
      suggested: true,
      kind: "yesNo",
      scope: "reply",
      label: "Ai nevoie de transport până la locație?",
      required: false,
      archived: false,
      answered: false,
    },
  ]);
});

test("age is a per-person choice of adult, child, baby", () => {
  const [age] = resolveQuestions([DEFAULT_QUESTIONS[0]], "en");
  expect(age).toMatchObject({
    kind: "choice",
    scope: "person",
    required: true,
  });
  expect(age.kind === "choice" && age.options.map((o) => o.id)).toEqual([
    "adult",
    "child",
    "baby",
  ]);
});

test("diet lists the six needs", () => {
  const [, diet] = resolveQuestions(DEFAULT_QUESTIONS, "en");
  expect(diet.kind).toBe("needs");
  expect(diet.kind === "needs" && diet.options.map((o) => o.id)).toEqual([
    "vegetarian",
    "vegan",
    "glutenFree",
    "lactoseFree",
    "nutAllergy",
    "other",
  ]);
});

test("accessibility is a person-scope needs question with its five options", () => {
  const [access] = resolveQuestions(
    [
      {
        id: "accessibility",
        suggested: true,
        required: false,
        archived: false,
        answered: false,
      },
    ],
    "en",
  );
  expect(access.kind).toBe("needs");
  expect(access.scope).toBe("person");
  expect(access.kind === "needs" && access.options.map((o) => o.id)).toEqual([
    "stepFree",
    "walking",
    "hearing",
    "sight",
    "other",
  ]);
});

test("every needs question has an Other option", () => {
  const needs = Object.values(SUGGESTED).filter(({ kind }) => kind === "needs");
  expect(needs.length).toBeGreaterThan(0);
  for (const { options } of needs) {
    expect(Object.keys(options ?? {})).toContain("other");
  }
});

test("a host's own question passes through unchanged", () => {
  expect(resolveQuestions([MEAL], "hu")).toEqual([MEAL]);
});

test("new events ask age then diet, both required", () => {
  expect(DEFAULT_QUESTIONS.map(({ id, required }) => [id, required])).toEqual([
    ["age", true],
    ["diet", true],
  ]);
});

test("ageOf and dietOf read only their own shape", () => {
  expect(ageOf({ age: "child" })).toBe("child");
  expect(ageOf({ age: "teen" })).toBeUndefined();
  expect(ageOf({ age: null })).toBeNull();
  expect(dietOf({ diet: { needs: [] } })).toEqual({ needs: [] });
  expect(dietOf({ diet: "vegan" })).toBeUndefined();
  expect(accessOf({ accessibility: { needs: ["hearing"] } })).toEqual({
    needs: ["hearing"],
  });
  expect(accessOf({ accessibility: "Ramp" })).toBeUndefined();
  expect(accessOf({ accessibility: null })).toBeNull();
});
