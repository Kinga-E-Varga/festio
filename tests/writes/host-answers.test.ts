import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema } from "@/db/schemas/event";
import type { GuestChanges } from "@/db/schemas/guest-changes";
import { writeGuestChanges } from "@/db/writes/guests";
import { newId } from "@/lib/id";
import { createEvent, NOW, refusedWith, TEST_HOST } from "../helpers/events";
import { DEFAULT_QUESTIONS } from "@/lib/suggested";
import { answeredById, MEAL, OLD, RIDE } from "../helpers/questions";

/* The host's answers in the guest list: type-checked, Required not enforced, archived still taken. */

function hostReply(
  answers: Record<string, unknown>,
  personAnswers: Record<string, unknown> = { meal: "o1" },
): GuestChanges {
  return {
    replies: {
      put: [
        {
          id: newId(),
          isNew: true,
          status: "going",
          message: null,
          answers,
          people: [{ id: newId(), name: "Ion Pop", answers: personAnswers }],
        },
      ],
      remove: [],
    },
    list: null,
  } as GuestChanges;
}

async function save(
  eventId: string,
  answers: Record<string, unknown>,
  personAnswers?: Record<string, unknown>,
) {
  return refusedWith(
    writeGuestChanges(
      TEST_HOST,
      eventId,
      hostReply(answers, personAnswers),
      NOW,
    ),
  );
}

async function replies(eventId: string) {
  return (await db.collection(paths.replies(eventId)).get()).docs.map((doc) =>
    doc.data(),
  );
}

test("the host may leave a required question empty", async () => {
  const { id } = await createEvent({ questions: [RIDE, MEAL] });
  expect(await save(id, { ride: null })).toBe("ok");
  const [card] = await replies(id);
  expect(card.answers).toEqual({ ride: null });
  const event = eventSchema.parse((await db.doc(paths.event(id)).get()).data());
  expect(answeredById(event.questions)).toEqual({ ride: false, meal: true });
});

test("the host's answer of the wrong type is refused", async () => {
  const { id } = await createEvent({ questions: [RIDE, MEAL] });
  expect(await save(id, { ride: "yes" })).toBe("invalid");
  expect(await replies(id)).toEqual([]);
});

test("the host keeps answers to an archived question", async () => {
  const { id } = await createEvent({ questions: [RIDE, MEAL, OLD] });
  expect(await save(id, { ride: true, old: "late" })).toBe("ok");
  const [card] = await replies(id);
  expect(card.answers).toEqual({ ride: true, old: "late" });
});

test("the host's diet answer is kept as sent", async () => {
  const { id } = await createEvent({ questions: DEFAULT_QUESTIONS });
  const diet = { needs: ["other"], other: "Shellfish" };
  expect(await save(id, {}, { diet })).toBe("ok");
  const [card] = await replies(id);
  expect(card.people[0].answers).toEqual({ diet });
});

test("the host's diet answer of the wrong type is refused", async () => {
  const { id } = await createEvent({ questions: DEFAULT_QUESTIONS });
  expect(await save(id, {}, { diet: "vegan" })).toBe("invalid");
  expect(await replies(id)).toEqual([]);
});
