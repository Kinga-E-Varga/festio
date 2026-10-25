import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { Question, QuestionInput } from "@/db/schemas/event";
import { writeInvitation } from "@/db/writes/invitation";
import { createEvent, TEST_HOST } from "../helpers/events";

/* Questions ride along with the invitation's Save; every expected list is worked out by hand. */

const A: Question = {
  id: "a",
  label: "Transport?",
  scope: "reply",
  kind: "yesNo",
  required: false,
  archived: false,
  answered: true,
};

const B: QuestionInput = {
  id: "b",
  label: "Song",
  scope: "reply",
  kind: "text",
  required: false,
  archived: false,
};

/** Saves a plain card from version 0, with these questions if given. */
function save(eventId: string, questions?: QuestionInput[]) {
  return writeInvitation(
    TEST_HOST,
    eventId,
    async () => ({
      kind: "simple",
      values: {},
      envelope: true,
      version: 0,
    }),
    questions,
  );
}

async function stored(eventId: string) {
  return (await db.doc(paths.event(eventId)).get()).data();
}

test("the host's questions are saved with the invitation", async () => {
  const { id } = await createEvent();
  const result = await save(id, [B]);
  const event = await stored(id);
  expect(event?.questions).toEqual([{ ...B, answered: false }]);
  expect(result.kept).toEqual([]);
  expect(event?.version).toBe(0);
  expect(event?.invitationVersion).toBe(1);
});

test("a question answered meanwhile survives the save", async () => {
  const { id } = await createEvent({ questions: [A] });
  const result = await save(id, []);
  expect((await stored(id))?.questions).toEqual([{ ...A, archived: true }]);
  expect(result.kept).toEqual(["a"]);
});

test("a save without questions leaves them as they are", async () => {
  const { id } = await createEvent({ questions: [A] });
  const result = await save(id);
  expect((await stored(id))?.questions).toEqual([A]);
  expect(result.questions).toEqual([A]);
  expect(result.kept).toEqual([]);
});
