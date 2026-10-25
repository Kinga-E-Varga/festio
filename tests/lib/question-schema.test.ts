import { expect, test } from "vitest";
import {
  questionInputSchema,
  questionSchema,
  questionsInputSchema,
} from "@/db/schemas/event";

/* Every limit here is the spec's: 10 active questions, 120 characters, 2–8 options of 60. */

/** A valid question as the host's editor sends it. */
function q(over: Record<string, unknown> = {}) {
  return {
    id: "q1",
    label: "Song?",
    scope: "reply",
    kind: "text",
    required: false,
    archived: false,
    ...over,
  };
}

function many(count: number, over: Record<string, unknown> = {}) {
  return Array.from({ length: count }, (_, index) =>
    q({ id: `q${index}`, ...over }),
  );
}

function choice(options: { id: string; label: string }[]) {
  return q({ kind: "choice", options });
}

function options(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: `o${index}`,
    label: `Option ${index}`,
  }));
}

const ok = (input: unknown) => questionsInputSchema.safeParse(input).success;

test("a stored question saved before the answered flag reads as not answered", () => {
  const stored = questionSchema.parse({
    id: "q-room",
    label: "Aveți nevoie de cazare?",
    scope: "reply",
    kind: "yesNo",
    required: false,
    archived: false,
  });
  expect(stored.answered).toBe(false);
});

test("ten active questions are accepted, eleven are not", () => {
  expect(ok(many(10))).toBe(true);
  expect(ok(many(11))).toBe(false);
});

test("archived questions don't count toward the ten", () => {
  expect(ok([...many(10), q({ id: "old", archived: true })])).toBe(true);
});

test("two questions with one id are refused", () => {
  expect(ok([q({ id: "x" }), q({ id: "x" })])).toBe(false);
});

test("wording up to 120 characters", () => {
  expect(ok([q({ label: "a".repeat(120) })])).toBe(true);
  expect(ok([q({ label: "a".repeat(121) })])).toBe(false);
  expect(ok([q({ label: "   " })])).toBe(false);
});

test("a choice needs 2 to 8 options", () => {
  expect(ok([choice(options(1))])).toBe(false);
  expect(ok([choice(options(2))])).toBe(true);
  expect(ok([choice(options(8))])).toBe(true);
  expect(ok([choice(options(9))])).toBe(false);
  expect(
    ok([
      choice([
        { id: "o1", label: "a".repeat(61) },
        { id: "o2", label: "Beef" },
      ]),
    ]),
  ).toBe(false);
  expect(
    ok([
      choice([
        { id: "o1", label: "Fish" },
        { id: "o1", label: "Beef" },
      ]),
    ]),
  ).toBe(false);
});

test("answered sent by the browser is not kept", () => {
  const parsed = questionInputSchema.parse({ ...q(), answered: true });
  expect("answered" in parsed).toBe(false);
});
