import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { guestListSchema } from "@/db/schemas/guest-list";
import { writeSentMark } from "@/db/writes/guests";
import {
  createEvent,
  listNames,
  refusedWith,
  storedEvent,
  TEST_HOST,
} from "../helpers/events";

/* Ticking a pre-loaded name as sent: its own small save, the list card alone. */

async function eventWithList(names: string[]) {
  const event = await createEvent({ preloaded: true });
  const list = listNames(names);
  await db.doc(paths.guestList(event.id)).set({ names: list, version: 3 });
  return { ...event, list };
}

async function storedList(eventId: string) {
  const snap = await db.doc(paths.guestList(eventId)).get();
  return guestListSchema.parse(snap.data());
}

test("a tick marks that one name sent and raises the list's version", async () => {
  const { id, list } = await eventWithList(["Ana Pop", "Ion Rusu"]);
  const result = await writeSentMark(TEST_HOST, id, {
    nameId: list[1].id,
    sent: true,
  });
  expect(result).toEqual({ listVersion: 4 });
  const stored = await storedList(id);
  expect(stored.version).toBe(4);
  expect(stored.names.map((name) => name.sent)).toEqual([false, true]);
});

test("unticking marks it not sent again", async () => {
  const { id, list } = await eventWithList(["Ana Pop"]);
  await writeSentMark(TEST_HOST, id, { nameId: list[0].id, sent: true });
  await writeSentMark(TEST_HOST, id, { nameId: list[0].id, sent: false });
  expect((await storedList(id)).names[0].sent).toBe(false);
});

test("a tick changes nothing on the event card", async () => {
  const { id, list, doc } = await eventWithList(["Ana Pop"]);
  await writeSentMark(TEST_HOST, id, { nameId: list[0].id, sent: true });
  const after = await storedEvent(id);
  expect(after.dataVersion).toBe(doc.dataVersion);
  expect(after.version).toBe(doc.version);
  expect(after.counts).toEqual(doc.counts);
});

test("a name deleted on another device is refused as changed there", async () => {
  const { id } = await eventWithList(["Ana Pop"]);
  expect(
    await refusedWith(
      writeSentMark(TEST_HOST, id, { nameId: "gone", sent: true }),
    ),
  ).toBe("stale");
});

test("another host's event is refused as not found", async () => {
  const { id, list } = await eventWithList(["Ana Pop"]);
  expect(
    await refusedWith(
      writeSentMark("someone-else", id, { nameId: list[0].id, sent: true }),
    ),
  ).toBe("notFound");
});
