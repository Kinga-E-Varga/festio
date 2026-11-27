import { Timestamp } from "firebase-admin/firestore";
import { describe, expect, it } from "vitest";
import { liveGuests } from "@/lib/live-guests";
import type { EventGuests } from "@/types/guests";

/** A reply card as a snapshot hands it over: ID, path, data(). */
function card(id: string, data: Record<string, unknown>) {
  return { id, ref: { path: `events/e1/replies/${id}` }, data: () => data };
}

/** A valid reply sent at `time` on one day, for one person. */
function reply(id: string, name: string, time: string) {
  return card(id, {
    sentAt: Timestamp.fromDate(new Date(`2029-01-10T${time}:00Z`)),
    status: "going",
    message: null,
    createdBy: "guest",
    people: [{ id: `${id}-p`, name }],
  });
}

const QUESTIONS: EventGuests["questions"] = [];

describe("liveGuests", () => {
  it("puts replies oldest first", () => {
    const guests = liveGuests(
      [reply("late", "Bea", "10:05"), reply("early", "Ana", "10:01")],
      undefined,
      QUESTIONS,
    );
    expect(guests.replies.map((r) => r.name)).toEqual(["Ana", "Bea"]);
  });

  it("leaves out a reply that fails its schema and keeps the other", () => {
    const broken = card("bad", {
      sentAt: Timestamp.fromDate(new Date("2029-01-10T10:02:00Z")),
      status: "going",
      message: null,
      createdBy: "guest",
    });
    const guests = liveGuests(
      [broken, reply("ok", "Ana", "10:01")],
      undefined,
      QUESTIONS,
    );
    expect(guests.replies.map((r) => r.name)).toEqual(["Ana"]);
  });

  it("reads a missing list card as no names, version 0", () => {
    const guests = liveGuests([], undefined, QUESTIONS);
    expect(guests.list).toEqual([]);
    expect(guests.listVersion).toBe(0);
  });

  it("reads the list card's names and version", () => {
    const guests = liveGuests(
      [],
      { names: [{ id: "n1", name: "Ana", sent: false }], version: 4 },
      QUESTIONS,
    );
    expect(guests.list).toEqual([{ id: "n1", name: "Ana", sent: false }]);
    expect(guests.listVersion).toBe(4);
  });

  it("passes the questions through unchanged", () => {
    const guests = liveGuests([], undefined, QUESTIONS);
    expect(guests.questions).toBe(QUESTIONS);
  });
});
