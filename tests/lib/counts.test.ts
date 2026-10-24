import { expect, test } from "vitest";
import { eventCounts, shownCounts } from "@/lib/guests";
import type { GuestReply, ListName } from "@/types/guests";

/* Every expected number is worked out by hand from the rows below. */

function reply(id: string, name: string, status: GuestReply["status"]) {
  return {
    id,
    submissionId: `r-${id}`,
    name,
    status,
    note: null,
    repliedAt: `2029-01-0${id.slice(1)}T10:00`,
    differentPerson: false,
  } satisfies GuestReply;
}

const list: ListName[] = [
  { id: "a", name: "Ana Pop", sent: false },
  { id: "d", name: "Dan Stan", sent: false },
];
const replies = [
  reply("p1", "Ana Pop", "going"),
  reply("p2", "ana pop", "going"),
  reply("p3", "Maria Ilie", "not_going"),
];

const COUNTS = eventCounts({ replies, list, questions: [], seatedIds: ["p3"] });

test("eventCounts counts both list settings", () => {
  expect(COUNTS).toEqual({
    coming: 2,
    notComing: 1,
    needsAttention: 3, // R1 + R2 share a name; R3 unlisted
    needsAttentionNoList: 2, // R1 + R2 only
    waiting: 1, // Dan Stan
    seatingWarnings: 1, // p3 seated, not coming
  });
});

test("shownCounts picks by the switch", () => {
  expect(shownCounts(COUNTS, true)).toEqual({ needsAttention: 3, waiting: 1 });
  expect(shownCounts(COUNTS, false)).toEqual({
    needsAttention: 2,
    waiting: 0,
  });
});
