import { afterAll, beforeAll, expect, test } from "vitest";
import { auth, db } from "@/db/admin";
import { countDbUse, takeDbCount } from "@/db/count";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { setGuestListOn } from "@/db/writes/guests";
import {
  createEvent,
  guestInput,
  listNames,
  newVisitor,
  NOW,
  saveList,
  shownStored,
  storedCounts,
  TEST_HOST,
} from "../helpers/events";

/* The list switch only picks which stored counters the pages show. */

beforeAll(() => countDbUse(db, auth));
afterAll(() => takeDbCount());

function reply(eventId: string, slug: string, name: string) {
  return writeGuestReply(
    eventId,
    slug,
    guestInput([name], "going"),
    newVisitor(),
    NOW,
  );
}

test("the switch keeps the stored counters and costs one read and one write", async () => {
  const event = await createEvent({ preloaded: true });
  await saveList(event.id, listNames(["Dan Stan", "Elena Toma"]));
  await reply(event.id, event.doc.slug, "Dan Stan");
  const stored = {
    coming: 1,
    notComing: 0,
    needsAttention: 0,
    needsAttentionNoList: 0,
    waiting: 1,
    seatingWarnings: 0,
  };
  expect(await storedCounts(event.id)).toEqual(stored);

  takeDbCount();
  await setGuestListOn(TEST_HOST, event.id, false);
  const used = takeDbCount();
  expect({ reads: used.reads, writes: used.writes }).toEqual({
    reads: 1,
    writes: 1,
  });
  expect(await storedCounts(event.id)).toEqual(stored);
  expect(await shownStored(event.id)).toEqual({
    needsAttention: 0,
    waiting: 0,
  });

  await setGuestListOn(TEST_HOST, event.id, true);
  expect(await shownStored(event.id)).toEqual({
    needsAttention: 0,
    waiting: 1,
  });
});

test("list off, guest reply keeps the list-on counters", async () => {
  const event = await createEvent({ preloaded: false });
  await saveList(event.id, listNames(["Ana Pop"]));
  await reply(event.id, event.doc.slug, "Maria Ilie");
  expect(await storedCounts(event.id)).toEqual({
    coming: 1,
    notComing: 0,
    needsAttention: 1,
    needsAttentionNoList: 0,
    waiting: 1,
    seatingWarnings: 0,
  });
});
