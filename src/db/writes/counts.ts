import type {
  DocumentReference,
  DocumentSnapshot,
  Query,
  QuerySnapshot,
  Transaction,
} from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCards, parseSnap } from "@/db/reads/parse";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { guestListSchema, type GuestListDoc } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { seatingSchema } from "@/db/schemas/seating";
import { replyKeys, type ReplyKeys } from "@/db/writes/reply-ref";
import {
  eventCounts,
  normalizeName,
  summaryOf,
  summaryOfPeople,
  toGuestReplies,
  type EventCounts,
  type ReplySummary,
  type StoredReply,
} from "@/lib/guests";
import { GROUP_MAX_NAMES, GROUP_MAX_ROUNDS } from "@/lib/config";
import type { GuestReply, ListName } from "@/types/guests";

/** The cards the counters are worked out from. */
export interface CountInputs {
  replies: StoredReply[];
  list: ListName[];
  seatedIds: string[];
}

/** Who has a seat, from the seating chart's card (missing = nobody). */
function seatedIdsOf(seating: DocumentSnapshot): string[] {
  const chart = parseSnap(seatingSchema, seating);
  return Object.keys(chart?.seats ?? {});
}

/** The list card, or an empty list at version 0 while it is missing. */
export function guestListOf(list: DocumentSnapshot): GuestListDoc {
  return parseSnap(guestListSchema, list) ?? { names: [], version: 0 };
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

/** Reads cards inside a transaction, or straight from the database. */
export interface CardReader {
  query(query: Query): Promise<QuerySnapshot>;
  doc(ref: DocumentReference): Promise<DocumentSnapshot>;
}

export function inTransaction(tx: Transaction): CardReader {
  return { query: (query) => tx.get(query), doc: (ref) => tx.get(ref) };
}

export const DIRECT: CardReader = {
  query: (query) => query.get(),
  doc: (ref) => ref.get(),
};

/** Firestore's most values in one `array-contains-any`. */
const ANY_MAX = 30;

/** The reply cards whose `field` holds any of `values`, 30 values a query. */
async function repliesWithAny(
  read: CardReader,
  eventId: string,
  field: keyof ReplyKeys,
  values: string[],
): Promise<StoredReply[]> {
  const chunks: string[][] = [];
  for (let at = 0; at < values.length; at += ANY_MAX)
    chunks.push(values.slice(at, at + ANY_MAX));
  const found = await Promise.all(
    chunks.map(async (chunk) => {
      const snapshot = await read.query(
        db
          .collection(paths.replies(eventId))
          .where(field, "array-contains-any", chunk),
      );
      return parseCards(replySchema, snapshot.docs);
    }),
  );
  /* A card can match two chunks: once each. */
  return [...new Map(found.flat().map((card) => [card.id, card])).values()];
}

/**
 * The cards that decide how these names count and are tagged: the replies
 * sharing one of them, the list and the replies the host matched to a list
 * name spelled like one of them (they hold those names). Every other reply
 * leaves them as they are. `withList` false skips the list and those
 * replies: tags with the list off never use them; counting always needs them.
 * Replies in reply order, as the rows claim list names (`buildRows`).
 */
export async function readNameGroup(
  read: CardReader,
  eventId: string,
  nameKeys: string[],
  withList = true,
): Promise<Pick<CountInputs, "replies" | "list">> {
  const [named, names] = await Promise.all([
    repliesWithAny(read, eventId, "nameKeys", nameKeys),
    withList ? read.doc(db.doc(paths.guestList(eventId))) : null,
  ]);
  const list = names ? guestListOf(names).names : [];
  const keys = new Set(nameKeys);
  const listed = list.flatMap((name) =>
    keys.has(normalizeName(name.name)) ? [name.id] : [],
  );
  const matched = await repliesWithAny(read, eventId, "listNameIds", listed);
  const replies = applied(named, { put: matched, remove: [] });
  return { replies: replies.sort(byReplyOrder), list };
}

/**
 * The cards a new reply can change the counters of, read inside a
 * transaction: its names' group (`readNameGroup`) and the seating chart.
 * Every other reply counts the same before and after it, so it is left out.
 */
export async function readReplyGroup(
  tx: Transaction,
  eventId: string,
  reply: StoredReply,
): Promise<CountInputs> {
  const { nameKeys } = replyKeys(reply.people);
  const [group, seating] = await Promise.all([
    readNameGroup(inTransaction(tx), eventId, nameKeys),
    tx.get(db.doc(paths.seating(eventId))),
  ]);
  return { ...group, seatedIds: seatedIdsOf(seating) };
}

/**
 * The event's counters once a new reply is saved: the difference it makes to
 * its group (`readReplyGroup`), added to the stored ones.
 */
export function countsWithReply(
  stored: EventCounts,
  group: CountInputs,
  reply: StoredReply,
  event: Pick<EventDoc, "questions">,
): EventCounts {
  const after = {
    ...group,
    replies: applied(group.replies, { put: [reply], remove: [] }),
  };
  return countsWithChange(stored, group, after, event);
}

/**
 * The stored counters plus the difference a change makes to the cards it can
 * reach, counted by `countsOf` before and after. Never below zero: counters
 * that drifted are fixed by the guest list page's recount (`repairCounts`),
 * and a negative one would fail the event card's schema.
 */
export function countsWithChange(
  stored: EventCounts,
  before: CountInputs,
  after: CountInputs,
  event: Pick<EventDoc, "questions">,
): EventCounts {
  const was = countsOf(before, event);
  const now = countsOf(after, event);
  return Object.fromEntries(
    (Object.keys(stored) as (keyof EventCounts)[]).map((key) => [
      key,
      Math.max(0, stored[key] + now[key] - was[key]),
    ]),
  ) as EventCounts;
}

/** One host save's change: the reply cards as stored and as saved, and the list before and after. */
export interface CardChange {
  before: StoredReply[];
  after: StoredReply[];
  listBefore: ListName[];
  listAfter: ListName[];
}

/**
 * The names a host save can change the counters of, normalized: everyone on
 * the cards it writes or deletes (before and after), list names added,
 * removed or renamed (both spellings), and the list names those people are
 * matched to. A list name whose only change is `sent` counts for nothing.
 */
export function affectedKeys(change: CardChange): string[] {
  const keys = new Set<string>();
  const add = (name: string | undefined) =>
    name !== undefined && keys.add(normalizeName(name));
  const was = new Map(change.listBefore.map((name) => [name.id, name.name]));
  const now = new Map(change.listAfter.map((name) => [name.id, name.name]));
  const people = [...change.before, ...change.after].flatMap(
    (reply) => reply.people,
  );
  for (const person of people) {
    add(person.name);
    if (!person.listNameId) continue;
    add(was.get(person.listNameId));
    add(now.get(person.listNameId));
  }
  for (const [id, name] of was)
    if (now.get(id) !== name) [name, now.get(id)].forEach(add);
  for (const [id, name] of now) if (!was.has(id)) add(name);
  return [...keys];
}

/**
 * The replies a change to these names (`affectedKeys`) can count differently:
 * those with one of the names, and those matched to a list name (from any of
 * `lists`) spelled like one. A reply found can bring more: its other names
 * and its matched list names' spellings are read in the next round, until a
 * round brings none. Null when that takes more than `limits.rounds` rounds or
 * more than `limits.names` names: the caller counts every reply instead.
 * Replies in reply order, as the rows claim list names (`buildRows`).
 */
export async function readChangeGroup(
  read: CardReader,
  eventId: string,
  keys: string[],
  lists: ListName[][],
  limits = { rounds: GROUP_MAX_ROUNDS, names: GROUP_MAX_NAMES },
): Promise<StoredReply[] | null> {
  const listed = lists.flat();
  const known = new Set<string>();
  const found = new Map<string, StoredReply>();
  let fresh = [...new Set(keys)];
  for (let round = 0; round < limits.rounds; round++) {
    fresh.forEach((key) => known.add(key));
    if (known.size > limits.names) return null;
    const wanted = new Set(fresh);
    const ids = listed.flatMap((name) =>
      wanted.has(normalizeName(name.name)) ? [name.id] : [],
    );
    const cards = await Promise.all([
      repliesWithAny(read, eventId, "nameKeys", fresh),
      repliesWithAny(read, eventId, "listNameIds", [...new Set(ids)]),
    ]);
    for (const card of cards.flat()) found.set(card.id, card);
    fresh = groupNames([...found.values()], listed).filter(
      (key) => !known.has(key),
    );
    if (fresh.length === 0) return [...found.values()].sort(byReplyOrder);
  }
  return null;
}

/** Every name these replies tie to: their people's, and their matched list names' spellings. */
function groupNames(replies: StoredReply[], list: ListName[]): string[] {
  const names = new Set<string>();
  for (const reply of replies) {
    const { nameKeys, listNameIds } = replyKeys(reply.people);
    nameKeys.forEach((key) => names.add(key));
    for (const name of list)
      if (listNameIds.includes(name.id)) names.add(normalizeName(name.name));
  }
  return [...names];
}

/**
 * The counters once a host save's change is written, read inside its
 * transaction: the difference it makes to its names' group (`keys`, from
 * `affectedKeys`; `readChangeGroup`) added to the stored ones, or, when the
 * group is too big to settle, every reply counted again.
 */
export async function countsWithHostChange(
  tx: Transaction,
  eventId: string,
  event: Pick<EventDoc, "questions" | "counts">,
  change: CardChange & { remove: string[]; keys: string[] },
): Promise<EventCounts> {
  const { listBefore, listAfter, keys } = change;
  const replies = { put: change.after, remove: change.remove };
  const [group, seating] = await Promise.all([
    readChangeGroup(inTransaction(tx), eventId, keys, [listBefore, listAfter]),
    tx.get(db.doc(paths.seating(eventId))),
  ]);
  if (!group) {
    const inputs = await readCountInputs(tx, eventId);
    return countsAfter({ ...inputs, list: listAfter }, replies, event);
  }
  const seatedIds = seatedIdsOf(seating);
  return countsWithChange(
    event.counts,
    { replies: group, list: listBefore, seatedIds },
    { replies: applied(group, replies), list: listAfter, seatedIds },
    event,
  );
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
 * The counters over these cards, with the event's questions.
 * Replies claim list names in order, so it sorts the replies itself; the list
 * keeps its saved order. Every caller (a save, the recount, the seed) counts
 * the same.
 */
export function countsOf(
  inputs: CountInputs,
  event: Pick<EventDoc, "questions">,
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
  event: Pick<EventDoc, "questions">,
): EventCounts {
  return eventCounts({
    replies: rows.replies,
    list: rows.list,
    questions: event.questions,
    seatedIds: rows.seatedIds,
  });
}

/** The counters once a save writes or deletes these reply cards, by ID. */
export function countsAfter(
  inputs: CountInputs,
  replies: { put: StoredReply[]; remove: string[] },
  event: Pick<EventDoc, "questions">,
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

function sameSummary(a: ReplySummary, b: ReplySummary): boolean {
  const same = (x: Record<string, number>, y: Record<string, number>) =>
    Object.keys(x).every((key) => x[key] === y[key]);
  return (
    same(a.ages, b.ages) &&
    same(a.diets, b.diets) &&
    a.answeredCustom === b.answeredCustom
  );
}

/**
 * Recounts the event and fixes the card's counters and reply summary when
 * they drifted. It counts the replies and names the page already loaded
 * (`loadGuests`, oldest first, the order `countsOf` uses), reading only the
 * event card and the seating chart, so an event that is fine never opens a
 * transaction (and never contends with a save). Only a difference is checked
 * again inside one, from every card, then written.
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
  const event = parseSnap(eventSchema, snap);
  if (!event) return;
  const quick = countRows(
    { ...loaded, seatedIds: seatedIdsOf(seating) },
    event,
  );
  const quickSummary = summaryOfPeople(loaded.replies);
  if (
    sameCounts(quick, event.counts) &&
    sameSummary(quickSummary, event.summary)
  )
    return;

  await db.runTransaction(async (tx) => {
    const current = parseSnap(eventSchema, await tx.get(ref));
    if (!current) return;
    const inputs = await readCountInputs(tx, eventId);
    const counts = countsOf(inputs, current);
    const summary = summaryOf(inputs.replies);
    const fix = {
      ...(!sameCounts(counts, current.counts) && { counts }),
      ...(!sameSummary(summary, current.summary) && { summary }),
    };
    if (Object.keys(fix).length > 0) tx.update(ref, fix);
  });
}
