import { Timestamp } from "firebase-admin/firestore";
import { expect, test } from "vitest";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { EventDoc } from "@/db/schemas/event";
import type { GuestReplyInput } from "@/db/schemas/reply";
import { unlockToken } from "@/db/secret";
import { writeGuestReply, type Visitor } from "@/db/writes/guest-reply";
import { REPLY_LIMIT_PER_HOUR } from "@/lib/config";
import { HOUR_MS } from "@/lib/event";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  refusedWith,
  storedCounts,
} from "../helpers/events";

/** A guest's reply to this event's link, from a new visitor at `NOW` unless told otherwise. */
function reply(
  event: { id: string; doc: EventDoc },
  sent: string[] | GuestReplyInput,
  {
    visitor = newVisitor(),
    now = NOW,
    slug = event.doc.slug,
  }: { visitor?: Visitor; now?: Date; slug?: string } = {},
) {
  const input = Array.isArray(sent) ? guestInput(sent) : sent;
  return refusedWith(writeGuestReply(event.id, slug, input, visitor, now));
}

async function replyCount(eventId: string): Promise<number> {
  const snapshot = await db.collection(paths.replies(eventId)).count().get();
  return snapshot.data().count;
}

/** A refused reply leaves no card behind and the counters as they were. */
async function expectNothingSaved(eventId: string) {
  const [count, counts] = await Promise.all([
    replyCount(eventId),
    storedCounts(eventId),
  ]);
  expect(count).toBe(0);
  expect(counts.coming).toBe(0);
}

test("a reply sent twice is saved once", async () => {
  const event = await createEvent();
  const input = guestInput(["Ana Pop", "Ion Pop"]);
  const visitor = newVisitor();
  expect(await reply(event, input, { visitor })).toBe("ok");
  expect(await reply(event, input, { visitor })).toBe("ok");
  expect(await replyCount(event.id)).toBe(1);
  expect((await storedCounts(event.id)).coming).toBe(2);
});

test("the reply over the hour's limit is refused", async () => {
  const event = await createEvent();
  const visitor = newVisitor();
  for (let i = 0; i < REPLY_LIMIT_PER_HOUR; i++) {
    expect(await reply(event, [`Guest ${i}`], { visitor })).toBe("ok");
  }
  expect(await reply(event, ["One too many"], { visitor })).toBe("tooMany");
  expect(await reply(event, ["One too many"])).toBe("ok");
});

test("the limit starts again the next hour", async () => {
  const event = await createEvent();
  const visitor = newVisitor();
  for (let i = 0; i < REPLY_LIMIT_PER_HOUR; i++) {
    expect(await reply(event, [`Guest ${i}`], { visitor })).toBe("ok");
  }
  const later = new Date(NOW.getTime() + HOUR_MS);
  expect(await reply(event, ["Next hour"], { visitor, now: later })).toBe("ok");
});

test("a reply after the closing time is refused, on the event's clock", async () => {
  /* Auckland is UTC+13 in January: 18:00 there is 05:00 UTC. */
  const event = await createEvent({
    timeZone: "Pacific/Auckland",
    date: "2029-01-20",
    repliesCloseAt: "2029-01-11T18:00",
  });
  const before = new Date("2029-01-11T04:59:00Z");
  const at = new Date("2029-01-11T05:00:00Z");
  expect(await reply(event, ["Early"], { now: before })).toBe("ok");
  expect(await reply(event, ["Late"], { now: at })).toBe("closed");
  expect(await replyCount(event.id)).toBe(1);
});

test("a Hidden invitation answers not found", async () => {
  const event = await createEvent({ visibility: "hidden" });
  expect(await reply(event, ["Ana"])).toBe("notFound");
  await expectNothingSaved(event.id);
});

test("a reply to another link answers not found", async () => {
  const event = await createEvent();
  expect(await reply(event, ["Ana"], { slug: `${event.doc.slug}x` })).toBe(
    "notFound",
  );
  await expectNothingSaved(event.id);
});

test("a Protected invitation needs the unlock cookie", async () => {
  const event = await createEvent({
    visibility: "protected",
    password: "abcd",
  });
  const withCookie = (unlock?: string) =>
    reply(event, ["Ana"], { visitor: { ...newVisitor(), unlock } });
  expect(await withCookie()).toBe("locked");
  expect(await withCookie(unlockToken(event.id, "wrong"))).toBe("locked");
  await expectNothingSaved(event.id);
  expect(await withCookie(unlockToken(event.id, "abcd"))).toBe("ok");
});

test("a cancelled event takes no replies", async () => {
  const event = await createEvent({
    cancelled: { message: "Sorry", at: Timestamp.now() },
  });
  expect(await reply(event, ["Ana"])).toBe("closed");
  await expectNothingSaved(event.id);
});
