import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { writeGuestChanges } from "@/db/writes/guests";
import { newId } from "@/lib/id";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  TEST_HOST,
} from "../helpers/events";

/* Every reply card carries its host's ID: the latest replies find them across events by it. */

async function storedHostId(eventId: string, replyId: string) {
  const snap = await db.doc(paths.reply(eventId, replyId)).get();
  return snap.get("hostId");
}

test("a guest's reply is stored with the event's host", async () => {
  const event = await createEvent();
  const input = guestInput(["Ana Pop"]);
  await writeGuestReply(event.id, event.doc.slug, input, newVisitor(), NOW);
  expect(await storedHostId(event.id, input.id)).toBe(TEST_HOST);
});

test("a reply the host adds or edits is stored with the host", async () => {
  const event = await createEvent();
  const id = newId();
  const person = { id: newId(), name: "Ion Rusu" };
  const card = {
    id,
    status: "going" as const,
    message: null,
    people: [person],
  };
  const save = (isNew: boolean, name: string) =>
    writeGuestChanges(
      TEST_HOST,
      event.id,
      {
        replies: {
          put: [{ ...card, isNew, people: [{ ...person, name }] }],
          remove: [],
        },
        list: null,
      },
      NOW,
    );

  await save(true, "Ion Rusu");
  expect(await storedHostId(event.id, id)).toBe(TEST_HOST);
  await save(false, "Ioan Rusu");
  expect(await storedHostId(event.id, id)).toBe(TEST_HOST);
});
