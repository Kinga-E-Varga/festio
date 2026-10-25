import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema } from "@/db/schemas/event";
import type { GuestReplyInput } from "@/db/schemas/reply";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { createEvent, newVisitor, NOW, refusedWith } from "../helpers/events";
import { answeredById, MEAL, OLD, RIDE, SONG } from "../helpers/questions";

/* A guest's answers to the host's questions; every expected card is worked out by hand. */

async function eventWith(questions = [RIDE, MEAL, SONG]) {
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

async function storedEvent(eventId: string) {
  return eventSchema.parse((await db.doc(paths.event(eventId)).get()).data());
}

test("a coming reply's answers are saved", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: true, song: "  Hey Jude " }))).toBe(
    "ok",
  );
  const card = await onlyReply(event.id);
  expect(card.answers).toEqual({ ride: true, song: "Hey Jude" });
  expect(card.people[0].answers).toEqual({ meal: "o2" });
  expect((await storedEvent(event.id)).summary.answeredCustom).toBe(1);
});

test("answering marks the questions answered", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: true, song: null }))).toBe("ok");
  expect(answeredById((await storedEvent(event.id)).questions)).toEqual({
    ride: true,
    meal: true,
    song: false,
  });
});

test("a not-coming reply keeps no answers", async () => {
  const event = await eventWith();
  expect(
    await send(event, ana({ ride: true, song: "Hey Jude" }, "not_going")),
  ).toBe("ok");
  const card = await onlyReply(event.id);
  expect(card.answers).toBeUndefined();
  expect(card.people[0].answers).toBeUndefined();
  expect(answeredById((await storedEvent(event.id)).questions)).toEqual({
    ride: false,
    meal: false,
    song: false,
  });
});

test("a coming reply that skips a required question is saved", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: null }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ ride: null });
});

test("an answer that no longer fits its question is dropped", async () => {
  const event = await eventWith();
  expect(await send(event, ana({ ride: "yes", song: "Hey Jude" }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ song: "Hey Jude" });
});

test("an answer to an archived question is dropped", async () => {
  const event = await eventWith([RIDE, MEAL, SONG, OLD]);
  expect(await send(event, ana({ ride: true, old: "x" }))).toBe("ok");
  expect((await onlyReply(event.id)).answers).toEqual({ ride: true });
});
