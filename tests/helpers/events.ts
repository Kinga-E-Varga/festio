import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { replySchema, type GuestReplyInput } from "@/db/schemas/reply";
import { countsOf, readCountInputs } from "@/db/writes/counts";
import { writeGuestChanges } from "@/db/writes/guests";
import type { Visitor } from "@/db/writes/guest-reply";
import { SaveRefused, type SaveError } from "@/db/writes/save";
import {
  EMPTY_COUNTS,
  EMPTY_SUMMARY,
  shownCounts,
  type EventCounts,
} from "@/lib/guests";
import { newId } from "@/lib/id";
import type { ListName } from "@/types/guests";

/*
 * What every test builds on: its own event with fresh IDs, so tests running
 * side by side never share a card.
 */

export const TEST_HOST = "host-test";

/** The moment the tests' saves happen at, unless a test needs its own. */
export const NOW = new Date("2029-01-10T12:00:00Z");

/** A link no other test uses: `test-` and 8 random letters or digits. */
function freshSlug(): string {
  return `test-${newId().replaceAll("-", "").slice(0, 8)}`;
}

/** Writes an event card (checked by its schema) with these fields over the defaults. */
export async function createEvent(
  overrides: Partial<EventDoc> = {},
): Promise<{ id: string; doc: EventDoc }> {
  const id = newId();
  const doc = eventSchema.parse({
    hostId: TEST_HOST,
    title: "Test event",
    kind: "wedding",
    language: "en",
    date: "2030-06-15",
    timeZone: "Europe/Bucharest",
    slug: freshSlug(),
    visibility: "public",
    expectedGuests: 1000,
    preloaded: false,
    package: "free",
    templateId: "wolf-dance",
    questions: [],
    counts: EMPTY_COUNTS,
    summary: EMPTY_SUMMARY,
    dataDeleted: false,
    version: 0,
    dataVersion: 0,
    invitationVersion: 0,
    createdAt: Timestamp.now(),
    ...overrides,
  });
  await db.doc(paths.event(id)).set(doc);
  return { id, doc };
}

/** A guest's form as sent: a new reply ID (unless given), one person per name. */
export function guestInput(
  names: string[],
  status: GuestReplyInput["status"] = "going",
  id = newId(),
): GuestReplyInput {
  return {
    id,
    status,
    message: null,
    people: names.map((name) => ({ name })),
  };
}

/** A visitor no other test has used, so their limits start at zero. */
export function newVisitor(): Visitor {
  return { key: newId() };
}

/** The counters stored on the event card. */
export async function storedCounts(eventId: string): Promise<EventCounts> {
  const snap = await db.doc(paths.event(eventId)).get();
  return eventSchema.parse(snap.data()).counts;
}

/** The event card as stored. */
export async function storedEvent(eventId: string): Promise<EventDoc> {
  return eventSchema.parse((await db.doc(paths.event(eventId)).get()).data());
}

/** The summary stored on the event card. */
export async function storedSummary(eventId: string) {
  return (await storedEvent(eventId)).summary;
}

/** One reply card as stored. */
export async function storedReply(eventId: string, replyId: string) {
  return replySchema.parse(
    (await db.doc(paths.reply(eventId, replyId)).get()).data(),
  );
}

/** The two counters the pages show, which follow the event's list switch. */
export async function shownStored(
  eventId: string,
): Promise<{ needsAttention: number; waiting: number }> {
  const snap = await db.doc(paths.event(eventId)).get();
  const { counts, preloaded } = eventSchema.parse(snap.data());
  return shownCounts(counts, preloaded);
}

/** Every card the counters come from, and the event card, read together. */
export async function readEvent(eventId: string) {
  return db.runTransaction(async (tx) => {
    const [inputs, snap] = await Promise.all([
      readCountInputs(tx, eventId),
      tx.get(db.doc(paths.event(eventId))),
    ]);
    return { ...inputs, event: eventSchema.parse(snap.data()) };
  });
}

/** The counters worked out again from every card, as the guest list page's recount does. */
export async function recount(eventId: string): Promise<EventCounts> {
  const { event, ...inputs } = await readEvent(eventId);
  return countsOf(inputs, event);
}

/** How a save ended: `ok`, or the reason it was refused. Any other error is thrown on. */
export async function refusedWith(
  save: Promise<unknown>,
): Promise<SaveError | "ok"> {
  try {
    await save;
    return "ok";
  } catch (error) {
    if (error instanceof SaveRefused) return error.reason;
    throw error;
  }
}

/** Pre-loaded names with fresh IDs, none sent yet. */
export function listNames(names: string[]): ListName[] {
  return names.map((name) => ({ id: newId(), name, sent: false }));
}

/** Saves the whole list, from the list's version the page read (0 before the first save). */
export function saveList(eventId: string, names: ListName[], version = 0) {
  return writeGuestChanges(
    TEST_HOST,
    eventId,
    { replies: { put: [], remove: [] }, list: { names, version } },
    NOW,
  );
}
