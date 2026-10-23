import type {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  Transaction,
} from "firebase-admin/firestore";
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
import type { ListName } from "@/types/guests";

/** The cards the counters are worked out from. */
export interface CountInputs {
  replies: StoredReply[];
  list: ListName[];
  seatedIds: string[];
}

/** How the cards are read: inside a transaction, or plainly. */
interface Reader {
  query(query: Query): Promise<QuerySnapshot>;
  doc(ref: DocumentReference): Promise<DocumentSnapshot>;
}

const plainReader: Reader = {
  query: (query) => query.get(),
  doc: (ref) => ref.get(),
};

async function readInputs(read: Reader, eventId: string): Promise<CountInputs> {
  const [replies, names, seating] = await Promise.all([
    read.query(db.collection(paths.replies(eventId)).orderBy("sentAt")),
    read.query(db.collection(paths.guestList(eventId))),
    read.doc(db.doc(paths.seating(eventId))),
  ]);
  const chart = seating.exists
    ? parseCard(seatingSchema, seating.ref.path, seating.data())
    : null;
  return {
    replies: parseCards(replySchema, replies.docs),
    list: parseCards(guestListNameSchema, names.docs),
    seatedIds: Object.keys(chart?.seats ?? {}),
  };
}

/**
 * The cards the counters are worked out from, read inside a transaction.
 * Reads only, so a caller can follow with its writes. The list keeps each
 * card's `version`, for saves that rewrite names.
 */
export function readCountInputs(
  tx: Transaction,
  eventId: string,
): Promise<CountInputs> {
  return readInputs(
    { query: (query) => tx.get(query), doc: (ref) => tx.get(ref) },
    eventId,
  );
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
  return eventCounts({
    replies: toGuestReplies([...inputs.replies].sort(byReplyOrder)),
    list: [...inputs.list].sort(byId),
    preloaded: event.preloaded,
    questions: event.questions,
    seatedIds: inputs.seatedIds,
  });
}

function sameCounts(a: EventCounts, b: EventCounts): boolean {
  return (Object.keys(a) as (keyof EventCounts)[]).every(
    (key) => a[key] === b[key],
  );
}

/**
 * Recounts the event and fixes the card's counters when they drifted. It
 * counts from plain reads first, so an event that is fine never opens a
 * transaction (and never contends with a save); only a difference is
 * checked again inside one, then written.
 */
export async function repairCounts(eventId: string): Promise<void> {
  const ref = db.doc(paths.event(eventId));
  const snap = await ref.get();
  if (!snap.exists) return;
  const event = parseCard(eventSchema, ref.path, snap.data());
  if (!event) return;
  const quick = countsOf(await readInputs(plainReader, eventId), event);
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
