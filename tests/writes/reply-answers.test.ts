import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { StoredQuestion } from "@/db/schemas/event";
import type { GuestReplyInput } from "@/db/schemas/reply";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { DEFAULT_QUESTIONS } from "@/lib/suggested";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  refusedWith,
  storedEvent,
  storedReply,
} from "../helpers/events";
import { answeredById, MEAL, OLD, RIDE } from "../helpers/questions";

/* A guest's answers to the host's questions; every expected card is worked out by hand. */

/** The helper's song question under an ID no suggested question takes. */
const TUNE: StoredQuestion = {
  id: "tune",
  label: "Song?",
  scope: "reply",
  kind: "text",
  required: false,
  archived: false,
  answered: false,
};

async function eventWith(questions: StoredQuestion[] = [RIDE, MEAL, TUNE]) {
  return createEvent({ questions });
}

function send(event: Awaited<ReturnType<typeof eventWith>>, input: unknown) {
  return refusedWith(
    writeGuestReply(
      event.id,
      event.doc.slug,
      input as GuestReplyInput,
      newVisitor(),
      NOW,
    ),
  );
}

function ana(
  answers: Record<string, unknown>,
  status: GuestReplyInput["status"] = "going",
) {
  return {
    id: crypto.randomUUID(),
    status,
    message: null,
    answers,
    people: [{ name: "Ana Pop", answers: { meal: "o2" } }],
  };
}

async function onlyReply(eventId: string) {
  const snap = await db.collection(paths.replies(eventId)).get();
  expect(snap.size).toBe(1);
  return snap.docs[0].data();
}

test("a coming reply's answers are saved", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: true, tune: "  Hey Jude " }))).toBe(
    "ok",
  );
  const card = await onlyReply(event.id);
  expect(card.answers).toEqual({ ride: true, tune: "Hey Jude" });
  expect(card.people[0].answers).toEqual({ meal: "o2" });
});

test("answering marks the questions answered", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: true, tune: null }))).toBe("ok");
  expect(answeredById((await storedEvent(event.id)).questions)).toEqual({
    ride: true,
    meal: true,
    tune: false,
  });
});

test("a not-coming reply keeps no answers", async () => {
  const event = await eventWith();
  expect(
    await send(event, ana({ ride: true, tune: "Hey Jude" }, "not_going")),
  ).toBe("ok");
  const card = await onlyReply(event.id);
  expect(card.answers).toBeUndefined();
  expect(card.people[0].answers).toBeUndefined();
  expect(answeredById((await storedEvent(event.id)).questions)).toEqual({
    ride: false,
    meal: false,
    tune: false,
  });
});

test("a coming reply that skips a required question is saved", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: null }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ ride: null });
});

test("an answer that no longer fits its question is dropped", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: "yes", tune: "Hey Jude" }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ tune: "Hey Jude" });
});

test("an answer to an archived question is dropped", async () => {
  const event = await eventWith([RIDE, MEAL, TUNE, OLD]);
  expect(await send(event, ana({ ride: true, old: "x" }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ ride: true });
});

test("a guest's age and diet are kept as answers and mark the questions answered", async () => {
  const { id, doc } = await createEvent({ questions: DEFAULT_QUESTIONS });
  const input: GuestReplyInput = {
    ...guestInput(["Ana Pop"]),
    people: [
      {
        name: "Ana Pop",
        answers: { age: "child", diet: { needs: ["vegan"] } },
      },
    ],
  };
  await writeGuestReply(id, doc.slug, input, newVisitor(), NOW);
  const [person] = (await storedReply(id, input.id)).people;
  expect(person.answers).toEqual({ age: "child", diet: { needs: ["vegan"] } });
  expect(answeredById((await storedEvent(id)).questions)).toEqual({
    age: true,
    diet: true,
  });
});

test("not coming keeps no age or diet", async () => {
  const { id, doc } = await createEvent({ questions: DEFAULT_QUESTIONS });
  const input: GuestReplyInput = {
    ...guestInput(["Ana Pop"], "not_going"),
    people: [
      {
        name: "Ana Pop",
        answers: { age: "child", diet: { needs: ["vegan"] } },
      },
    ],
  };
  await writeGuestReply(id, doc.slug, input, newVisitor(), NOW);
  const [person] = (await storedReply(id, input.id)).people;
  expect(person.answers).toBeUndefined();
  expect(answeredById((await storedEvent(id)).questions)).toEqual({
    age: false,
    diet: false,
  });
});
