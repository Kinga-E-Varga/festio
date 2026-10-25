import { expect, test } from "vitest";
import type { Question } from "@/db/schemas/event";
import {
  checkAnswers,
  GUEST_RULES,
  HOST_RULES,
  markAnswered,
} from "@/lib/answers";
import { RSVP_ANSWER_MAX } from "@/db/limits";
import { DEFAULT_QUESTIONS, resolveQuestions } from "@/lib/suggested";
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

const [AGE, DIET] = resolveQuestions(DEFAULT_QUESTIONS, "en");

test("diet needs are kept once each", () => {
  expect(
    checkAnswers(
      [DIET],
      "person",
      { diet: { needs: ["vegan", "vegan"] } },
      HOST_RULES,
    ),
  ).toEqual({ ok: true, answers: { diet: { needs: ["vegan"] } } });
});

test("Other's words are trimmed and kept", () => {
  expect(
    checkAnswers(
      [DIET],
      "person",
      { diet: { needs: ["other"], other: "  No onions " } },
      HOST_RULES,
    ),
  ).toEqual({
    ok: true,
    answers: { diet: { needs: ["other"], other: "No onions" } },
  });
});

test("words without Other, or only spaces, are dropped", () => {
  expect(
    checkAnswers(
      [DIET],
      "person",
      { diet: { needs: ["vegan"], other: "x" } },
      HOST_RULES,
    ),
  ).toEqual({ ok: true, answers: { diet: { needs: ["vegan"] } } });
  expect(
    checkAnswers(
      [DIET],
      "person",
      { diet: { needs: ["other"], other: "   " } },
      HOST_RULES,
    ),
  ).toEqual({ ok: true, answers: { diet: { needs: ["other"] } } });
});

test("no needs is an answer", () => {
  expect(
    checkAnswers([DIET], "person", { diet: { needs: [] } }, GUEST_RULES),
  ).toEqual({ ok: true, answers: { diet: { needs: [] } } });
});

test("a diet of the wrong shape refuses the host and is dropped for a guest", () => {
  expect(checkAnswers([DIET], "person", { diet: "vegan" }, HOST_RULES)).toEqual(
    { ok: false },
  );
  expect(
    checkAnswers([DIET], "person", { diet: "vegan" }, GUEST_RULES),
  ).toEqual({ ok: true, answers: undefined });
});

test("Other's words past the limit refuse the host", () => {
  expect(
    checkAnswers(
      [DIET],
      "person",
      { diet: { needs: ["other"], other: "a".repeat(RSVP_ANSWER_MAX + 1) } },
      HOST_RULES,
    ),
  ).toEqual({ ok: false });
});

test("age takes only its three groups", () => {
  expect(checkAnswers([AGE], "person", { age: "child" }, HOST_RULES)).toEqual({
    ok: true,
    answers: { age: "child" },
  });
  expect(checkAnswers([AGE], "person", { age: "teen" }, HOST_RULES)).toEqual({
    ok: false,
  });
});

const [ACCESS] = resolveQuestions(
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

test("accessibility needs are kept once each, in the question's order", () => {
  expect(
    checkAnswers(
      [ACCESS],
      "person",
      { accessibility: { needs: ["hearing", "stepFree", "hearing"] } },
      HOST_RULES,
    ),
  ).toEqual({
    ok: true,
    answers: { accessibility: { needs: ["stepFree", "hearing"] } },
  });
});

test("a need that isn't the question's own refuses the host and is dropped for a guest", () => {
  const sent = { accessibility: { needs: ["vegan"] } };
  expect(checkAnswers([ACCESS], "person", sent, HOST_RULES)).toEqual({
    ok: false,
  });
  expect(checkAnswers([ACCESS], "person", sent, GUEST_RULES)).toEqual({
    ok: true,
    answers: undefined,
  });
});

test("accessibility's Other words are trimmed", () => {
  expect(
    checkAnswers(
      [ACCESS],
      "person",
      { accessibility: { needs: ["other"], other: "  Guide dog " } },
      HOST_RULES,
    ),
  ).toEqual({
    ok: true,
    answers: { accessibility: { needs: ["other"], other: "Guide dog" } },
  });
});

test("accessibility's Other words that are too long refuse the host", () => {
  expect(
    checkAnswers(
      [ACCESS],
      "person",
      {
        accessibility: {
          needs: ["other"],
          other: "a".repeat(RSVP_ANSWER_MAX + 1),
        },
      },
      HOST_RULES,
    ),
  ).toEqual({ ok: false });
});

test("words are dropped when Other isn't picked", () => {
  expect(
    checkAnswers(
      [ACCESS],
      "person",
      { accessibility: { needs: ["hearing"], other: "x" } },
      HOST_RULES,
    ),
  ).toEqual({
    ok: true,
    answers: { accessibility: { needs: ["hearing"] } },
  });
});

test("accessibility as plain text refuses the host", () => {
  expect(
    checkAnswers([ACCESS], "person", { accessibility: "Ramp" }, HOST_RULES),
  ).toEqual({ ok: false });
});

test("a removed diet question drops a guest's diet answer", () => {
  expect(
    checkAnswers(
      [{ ...DIET, archived: true }],
      "person",
      { diet: { needs: ["vegan"] } },
      GUEST_RULES,
    ),
  ).toEqual({ ok: true, answers: undefined });
});
