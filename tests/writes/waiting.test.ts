import { expect, test } from "vitest";
import type { ListName } from "@/types/guests";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { setGuestListOn, writeGuestChanges } from "@/db/writes/guests";
import { newId } from "@/lib/id";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  storedCounts,
  TEST_HOST,
} from "../helpers/events";

/*
 * `waiting` (pre-loaded names no reply claims) is kept on the event card, so
 * host pages never read the replies to show it.
 */

function listNames(names: string[]): ListName[] {
  return names.map((name) => ({ id: newId(), name, sent: false }));
}

function saveList(eventId: string, names: ListName[], version: number) {
  return writeGuestChanges(
    TEST_HOST,
    eventId,
    { replies: { put: [], remove: [] }, list: { names, version } },
    NOW,
  );
}

async function waiting(eventId: string): Promise<number> {
  return (await storedCounts(eventId)).waiting;
}

test("waiting follows guest replies, list changes, deletes and the list switch", async () => {
  const event = await createEvent({ preloaded: true });
  const reply = (names: string[], id?: string) =>
    writeGuestReply(
      event.id,
      event.doc.slug,
      guestInput(names, "going", id),
      newVisitor(),
      NOW,
    );

  const list = listNames(["Ana Pop", "Ion Rusu", "Dan Stan"]);
  const { listVersion } = await saveList(event.id, list, 0);
  expect(await waiting(event.id)).toBe(3);

  /* Spelled differently, the same name: it claims Ana Pop. */
  await reply(["ana pop"]);
  expect(await waiting(event.id)).toBe(2);

  /* Ana Pop is taken: this one claims nothing. */
  await reply(["Ana Pop"]);
  expect(await waiting(event.id)).toBe(2);

  /* Ion Rusu claims his name; Maria Ilie isn't on the list. */
  const ionAndMaria = newId();
  await reply(["Ion Rusu", "Maria Ilie"], ionAndMaria);
  expect(await waiting(event.id)).toBe(1);

  /* Maria Ilie's reply claims her new name; Dan Stan and Elena Toma wait. */
  await saveList(
    event.id,
    [...list, ...listNames(["Maria Ilie", "Elena Toma"])],
    listVersion,
  );
  expect(await waiting(event.id)).toBe(2);

  await setGuestListOn(TEST_HOST, event.id, false);
  expect(await waiting(event.id)).toBe(0);

  await setGuestListOn(TEST_HOST, event.id, true);
  expect(await waiting(event.id)).toBe(2);

  /* Their reply deleted: Ion Rusu and Maria Ilie wait again, with Dan Stan and Elena Toma. */
  await writeGuestChanges(
    TEST_HOST,
    event.id,
    { replies: { put: [], remove: [ionAndMaria] }, list: null },
    NOW,
  );
  expect(await waiting(event.id)).toBe(4);
});
