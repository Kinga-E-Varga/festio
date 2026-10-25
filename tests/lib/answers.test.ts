import { expect, test } from "vitest";
import type { Question } from "@/db/schemas/event";
import {
  checkAnswers,
  GUEST_RULES,
  HOST_RULES,
  markAnswered,
} from "@/lib/answers";
import { answeredById, MEAL, OLD, RIDE, SONG } from "../helpers/questions";

/* Every expected result is worked out by hand from the spec's storage rules and the four shared questions. */

const Q: Question[] = [SONG, RIDE, MEAL, OLD];

test("answers are kept, text trimmed", () => {
  expect(
    checkAnswers(
      Q,
      "reply",
      { song: "  Dancing Queen ", ride: true },
      GUEST_RULES,
    ),
  ).toEqual({ ok: true, answers: { song: "Dancing Queen", ride: true } });
});

test("unknown, archived and other-scope answers are dropped", () => {
  expect(
    checkAnswers(
      Q,
      "reply",
      { ride: false, old: "x", meal: "o1", ghost: "y" },
      GUEST_RULES,
    ),
  ).toEqual({ ok: true, answers: { ride: false } });
});

test("a question the form never showed stays missing", () => {
  expect(checkAnswers(Q, "reply", { song: "x" }, GUEST_RULES)).toEqual({
    ok: true,
    answers: { song: "x" },
  });
});

test("empty text is skipped", () => {
  expect(
    checkAnswers(Q, "reply", { ride: true, song: "   " }, GUEST_RULES),
  ).toEqual({ ok: true, answers: { ride: true, song: null } });
});

test("a guest's required question left empty is kept as skipped", () => {
  /* The form opened before the host turned Required on: the reply still goes in. */
  expect(checkAnswers(Q, "reply", { ride: null }, GUEST_RULES)).toEqual({
    ok: true,
    answers: { ride: null },
  });
});

test("a guest's answer that no longer fits its question is dropped", () => {
  /* The form opened before the host changed the question: treated as never asked. */
  const dropped = { ok: true, answers: undefined };
  expect(checkAnswers(Q, "reply", { ride: "yes" }, GUEST_RULES)).toEqual(
    dropped,
  );
  expect(checkAnswers(Q, "reply", { song: false }, GUEST_RULES)).toEqual(
    dropped,
  );
  expect(
    checkAnswers(Q, "reply", { song: "a".repeat(201) }, GUEST_RULES),
  ).toEqual(dropped);
  expect(checkAnswers(Q, "person", { meal: "o3" }, GUEST_RULES)).toEqual(
    dropped,
  );
  expect(checkAnswers(Q, "person", { meal: true }, GUEST_RULES)).toEqual(
    dropped,
  );
  expect(
    checkAnswers(Q, "reply", { ride: "yes", song: "Hey Jude" }, GUEST_RULES),
  ).toEqual({ ok: true, answers: { song: "Hey Jude" } });
});

test("the host's answer of the wrong type is refused", () => {
  const refused = { ok: false };
  expect(checkAnswers(Q, "reply", { ride: "yes" }, HOST_RULES)).toEqual(
    refused,
  );
  expect(checkAnswers(Q, "person", { meal: "o3" }, HOST_RULES)).toEqual(
    refused,
  );
  expect(
    checkAnswers(Q, "reply", { song: "a".repeat(201) }, HOST_RULES),
  ).toEqual(refused);
});

test("text of 200 characters is kept", () => {
  const song = "a".repeat(200);
  expect(checkAnswers(Q, "reply", { song }, GUEST_RULES)).toEqual({
    ok: true,
    answers: { song },
  });
});

test("the host may skip required and answer archived", () => {
  expect(
    checkAnswers(Q, "reply", { ride: null, old: "kept" }, HOST_RULES),
  ).toEqual({ ok: true, answers: { ride: null, old: "kept" } });
});

test("no answers is no answers", () => {
  const none = { ok: true, answers: undefined };
  expect(checkAnswers(Q, "reply", undefined, GUEST_RULES)).toEqual(none);
  expect(checkAnswers(Q, "reply", {}, GUEST_RULES)).toEqual(none);
  expect(checkAnswers(Q, "reply", { ghost: "y" }, GUEST_RULES)).toEqual(none);
});

test("answering marks the question", () => {
  const marked = markAnswered(Q, [{ song: null, ride: true }, { meal: "o1" }]);
  expect(answeredById(marked ?? [])).toEqual({
    song: false,
    ride: true,
    meal: true,
    old: true,
  });
});

test("nothing new answered changes nothing", () => {
  expect(markAnswered(Q, [{ old: "x" }, undefined, { song: null }])).toBe(null);
});
