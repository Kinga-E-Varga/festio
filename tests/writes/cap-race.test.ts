import { expect, test } from "vitest";
import { writeGuestReply } from "@/db/writes/guest-reply";
import { replyCap } from "@/lib/event";
import {
  createEvent,
  guestInput,
  newVisitor,
  NOW,
  recount,
  refusedWith,
  storedCounts,
} from "../helpers/events";

/** `count` people with names no one else in this test has, so Duplicate never comes into it. */
function people(count: number, prefix: string): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix} ${i}`);
}

test("simultaneous replies never pass the cap by more than one reply", async () => {
  const { id, doc } = await createEvent({ expectedGuests: 10 });
  const cap = replyCap(10);
  const send = (names: string[]) =>
    refusedWith(
      writeGuestReply(id, doc.slug, guestInput(names), newVisitor(), NOW),
    );

  /* Up to 5 under the cap, one reply after the other. */
  for (let filled = 0, n = 0; filled < cap - 5; n++) {
    const size = Math.min(5, cap - 5 - filled);
    expect(await send(people(size, `Early ${n}`))).toBe("ok");
    filled += size;
  }

  /* 20 guests of 3 people at the same moment: two fit (cap - 5 → cap - 2 → cap + 1), then it pauses. */
  const results = await Promise.all(
    /* An aborted transaction is kept as its message, so the check below lists it. */
    Array.from({ length: 20 }, (_, n) =>
      send(people(3, `Late ${n}`)).catch((error: unknown) => String(error)),
    ),
  );
  const other = results.filter(
    (result) => result !== "ok" && result !== "paused",
  );
  expect(other, "replies that failed instead of saving or pausing").toEqual([]);

  const [counts, recounted] = await Promise.all([
    storedCounts(id),
    recount(id),
  ]);
  expect(counts.coming + counts.notComing).toBe(cap + 1);
  expect(results.filter((result) => result === "ok")).toHaveLength(2);
  expect(counts).toEqual(recounted);
}, 60_000);
