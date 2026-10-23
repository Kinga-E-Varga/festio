import type { DocumentSnapshot, Transaction } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard, parseCards } from "@/db/reads/parse";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { guestListNameSchema } from "@/db/schemas/guest-list";
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

/**
 * The cards the counters are worked out from, read inside a transaction.
 * Reads only, so a caller can follow with its writes. The list keeps each
 * card's `version`, for saves that rewrite names.
 */
export async function readCountInputs(
  tx: Transaction,
  eventId: string,
): Promise<CountInputs> {
  const [replies, names, seating] = await Promise.all([
    tx.get(db.collection(paths.replies(eventId)).orderBy("sentAt")),
    tx.get(db.collection(paths.guestList(eventId))),
    tx.get(db.doc(paths.seating(eventId))),
  ]);
  return {
    replies: parseCards(replySchema, replies.docs),
    list: parseCards(guestListNameSchema, names.docs),
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

/** The list in Firestore's order, by card ID. */
function byId(first: { id: string }, second: { id: string }): number {
  return first.id < second.id ? -1 : first.id > second.id ? 1 : 0;
}

/**
 * The counters over these cards, with the event's list switch and questions.
 * Replies claim list names in order, so it sorts them itself: every caller
 * (a save, the recount, the seed) counts the same.
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

/** The counters over replies already in reply order, as rows; the list is sorted here. */
function countRows(
  rows: { replies: GuestReply[]; list: ListName[]; seatedIds: string[] },
  event: Pick<EventDoc, "preloaded" | "questions">,
): EventCounts {
  return eventCounts({
    replies: rows.replies,
    list: [...rows.list].sort(byId),
    preloaded: event.preloaded,
    questions: event.questions,
    seatedIds: rows.seatedIds,
  });
}

/** Cards a save writes or deletes, by ID. */
export interface CardChange {
  replies?: { put: StoredReply[]; remove: string[] };
  list?: { put: ListName[]; remove: string[] };
}

/** Cards by ID, with a change applied: deleted ones gone, written ones in. */
function applied<T extends { id: string }>(
  cards: T[],
  change: { put: T[]; remove: string[] } | undefined,
): T[] {
  const byId = new Map(cards.map((card) => [card.id, card]));
  for (const id of change?.remove ?? []) byId.delete(id);
  for (const card of change?.put ?? []) byId.set(card.id, card);
  return [...byId.values()];
}

/** The counters over the cards as they will stand once a save's change is written. */
export function countsAfter(
  inputs: CountInputs,
  change: CardChange,
  event: Pick<EventDoc, "preloaded" | "questions">,
): EventCounts {
  return countsOf(
    {
      replies: applied(inputs.replies, change.replies),
      list: applied(inputs.list, change.list),
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
