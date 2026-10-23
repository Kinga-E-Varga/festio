import type { DocumentSnapshot, Transaction } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard, parseCards } from "@/db/reads/parse";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { guestListSchema, type GuestListDoc } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { seatingSchema } from "@/db/schemas/seating";
import {
  eventCounts,
  toGuestReplies,
  type EventCounts,
  type StoredReply,
} from "@/lib/guests";
import type { GuestReply, ListName } from "@/types/guests";

/** The cards the counters are worked out from. */
export interface CountInputs {
  replies: StoredReply[];
  list: ListName[];
  seatedIds: string[];
}

/** Who has a seat, from the seating chart's card (missing = nobody). */
function seatedIdsOf(seating: DocumentSnapshot): string[] {
  const chart = seating.exists
    ? parseCard(seatingSchema, seating.ref.path, seating.data())
    : null;
  return Object.keys(chart?.seats ?? {});
}

/** The list card, or an empty list at version 0 while it is missing. */
export function guestListOf(list: DocumentSnapshot): GuestListDoc {
  const card = list.exists
    ? parseCard(guestListSchema, list.ref.path, list.data())
    : null;
  return card ?? { names: [], version: 0 };
}

/**
 * The cards the counters are worked out from, read inside a transaction,
 * with the list card's version for saves that rewrite it. Reads only, so a
 * caller can follow with its writes.
 */
export async function readCountInputs(
  tx: Transaction,
  eventId: string,
): Promise<CountInputs & { listVersion: number }> {
  const [replies, names, seating] = await Promise.all([
    tx.get(db.collection(paths.replies(eventId)).orderBy("sentAt")),
    tx.get(db.doc(paths.guestList(eventId))),
    tx.get(db.doc(paths.seating(eventId))),
  ]);
  const list = guestListOf(names);
  return {
    replies: parseCards(replySchema, replies.docs),
    list: list.names,
    listVersion: list.version,
    seatedIds: seatedIdsOf(seating),
  };
}

/** Replies in Firestore's order: by when they came, then by card ID. */
function byReplyOrder(first: StoredReply, second: StoredReply): number {
  const time =
    first.sentAt.seconds - second.sentAt.seconds ||
    first.sentAt.nanoseconds - second.sentAt.nanoseconds;
  return time || byId(first, second);
}

/** By card ID: Firestore's order for cards sent at the same moment. */
function byId(first: { id: string }, second: { id: string }): number {
  return first.id < second.id ? -1 : first.id > second.id ? 1 : 0;
}

/** Cards by ID, with a change applied: deleted ones gone, written ones in. */
function applied<T extends { id: string }>(
  cards: T[],
  change: { put: T[]; remove: string[] },
): T[] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  for (const id of change.remove) byId.delete(id);
  for (const card of change.put) byId.set(card.id, card);
  return [...byId.values()];
}

/**
 * The counters over these cards, with the event's list switch and questions.
 * Replies claim list names in order, so it sorts the replies itself; the list
 * keeps its saved order. Every caller (a save, the recount, the seed) counts
 * the same.
 */
export function countsOf(
  inputs: CountInputs,
  event: Pick<EventDoc, "preloaded" | "questions">,
): EventCounts {
  return countRows(
    {
      replies: toGuestReplies([...inputs.replies].sort(byReplyOrder)),
      list: inputs.list,
      seatedIds: inputs.seatedIds,
    },
    event,
  );
}

/** The counters over replies already in reply order, as rows. */
function countRows(
  rows: { replies: GuestReply[]; list: ListName[]; seatedIds: string[] },
  event: Pick<EventDoc, "preloaded" | "questions">,
): EventCounts {
  return eventCounts({
    replies: rows.replies,
    list: rows.list,
    preloaded: event.preloaded,
    questions: event.questions,
    seatedIds: rows.seatedIds,
  });
}

/** The counters once a save writes or deletes these reply cards, by ID. */
export function countsAfter(
  inputs: CountInputs,
  replies: { put: StoredReply[]; remove: string[] },
  event: Pick<EventDoc, "preloaded" | "questions">,
): EventCounts {
  return countsOf(
    {
      replies: applied(inputs.replies, replies),
      list: inputs.list,
      seatedIds: inputs.seatedIds,
    },
    event,
  );
}

function sameCounts(a: EventCounts, b: EventCounts): boolean {
  return (Object.keys(a) as (keyof EventCounts)[]).every(
    (key) => a[key] === b[key],
  );
}

/**
 * Recounts the event and fixes the card's counters when they drifted. It
 * counts the replies and names the page already loaded (`loadGuests`, oldest
 * first, the order `countsOf` uses), reading only the event card and the
 * seating chart, so an event that is fine never opens a transaction (and
 * never contends with a save). Only a difference is checked again inside
 * one, from every card, then written.
 */
export async function repairCounts(
  eventId: string,
  loaded: { replies: GuestReply[]; list: ListName[] },
): Promise<void> {
  const ref = db.doc(paths.event(eventId));
  const [snap, seating] = await Promise.all([
    ref.get(),
    db.doc(paths.seating(eventId)).get(),
  ]);
  if (!snap.exists) return;
  const event = parseCard(eventSchema, ref.path, snap.data());
  if (!event) return;
  const quick = countRows(
    { ...loaded, seatedIds: seatedIdsOf(seating) },
    event,
  );
  if (sameCounts(quick, event.counts)) return;

  await db.runTransaction(async (tx) => {
    const fresh = await tx.get(ref);
    if (!fresh.exists) return;
    const current = parseCard(eventSchema, ref.path, fresh.data());
    if (!current) return;
    const counts = countsOf(await readCountInputs(tx, eventId), current);
    if (!sameCounts(counts, current.counts)) tx.update(ref, { counts });
  });
}
