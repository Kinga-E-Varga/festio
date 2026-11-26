import { Timestamp, type Transaction } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { GuestChanges } from "@/db/schemas/guest-changes";
import { parseCards } from "@/db/reads/parse";
import type { GuestListDoc, SentMark } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import {
  affectedKeys,
  countsWithHostChange,
  guestListOf,
} from "@/db/writes/counts";
import { ownEvent } from "@/db/writes/event";
import { replyRef } from "@/db/writes/reply-ref";
import { expectVersion, SaveRefused } from "@/db/writes/save";
import type { EventDoc, Question } from "@/db/schemas/event";
import { HOST_RULES, markAnswered } from "@/lib/answers";
import { replyCap } from "@/lib/event";
import { checkedAnswers } from "@/db/writes/answers";
import { summaryAfter, type StoredReply } from "@/lib/guests";
import { resolveQuestions } from "@/lib/suggested";

/**
 * The reply cards to write. Replies keep when they came in and who sent
 * them. A card split off from another (`from`) takes that card's; a brand
 * new one is the host's. A card edited here but deleted on another device is
 * not brought back. A split comes with its source card, saved or deleted in
 * the same save, else its people would be on both.
 */
function replyCards(
  replies: GuestChanges["replies"],
  stored: Map<string, StoredReply>,
  at: Timestamp,
): StoredReply[] {
  const sent = new Set([
    ...replies.put.filter(({ isNew }) => !isNew).map(({ id }) => id),
    ...replies.remove,
  ]);
  return replies.put.map(({ isNew, from, ...input }): StoredReply => {
    const own = stored.get(input.id);
    if (isNew ? own : !own) throw new SaveRefused("stale");
    if (!isNew && from) throw new SaveRefused("invalid");
    if (from && !sent.has(from)) throw new SaveRefused("invalid");
    const source = own ?? (from ? stored.get(from) : undefined);
    if (from && !source) throw new SaveRefused("stale");
    /* Separate only moves people who were on the card it names. */
    const ids = new Set(source?.people.map((person) => person.id));
    if (from && !input.people.every((person) => ids.has(person.id)))
      throw new SaveRefused("invalid");
    if (!source) return { ...input, sentAt: at, createdBy: "host" };
    return {
      ...input,
      sentAt: source.sentAt,
      createdBy: source.createdBy,
      editedAt: at,
    };
  });
}

/**
 * A card's answers checked against the event's questions, the host's way:
 * any type mismatch refuses the save, Required isn't enforced (the host may
 * not know), and archived questions still take answers (the guest list
 * shows them).
 */
function withCheckedAnswers(
  card: StoredReply,
  questions: Question[],
): StoredReply {
  const check = (scope: Question["scope"], sent: StoredReply["answers"]) =>
    checkedAnswers(questions, scope, sent, HOST_RULES);
  return {
    ...card,
    answers: check("reply", card.answers),
    people: card.people.map((person) => ({
      ...person,
      answers: check("person", person.answers),
    })),
  };
}

/** Everyone on these cards, coming or not. */
function peopleOn(cards: StoredReply[]): number {
  return cards.reduce((sum, card) => sum + card.people.length, 0);
}

/**
 * The reply cap stops the host too: a save that adds people is refused if
 * the event then holds more than the cap. Judged on the result, unlike a
 * guest's reply, so one save of many replies can't jump past it. Edits and
 * deletes that keep or lower the number are always saved.
 */
function refuseOverCap(
  event: Pick<EventDoc, "counts" | "expectedGuests">,
  before: StoredReply[],
  after: StoredReply[],
): void {
  const added = peopleOn(after) - peopleOn(before);
  const now = event.counts.coming + event.counts.notComing;
  if (added > 0 && now + added > replyCap(event.expectedGuests))
    throw new SaveRefused("full");
}

/**
 * The cards a host save starts from: the list card, and the reply cards it
 * names (written, split from or deleted) by ID. A save of the list alone
 * reads no reply card.
 */
async function readChanged(
  tx: Transaction,
  eventId: string,
  replies: GuestChanges["replies"],
): Promise<{ list: GuestListDoc; stored: Map<string, StoredReply> }> {
  const ids = new Set([
    ...replies.put.flatMap(({ id, from }) => (from ? [id, from] : [id])),
    ...replies.remove,
  ]);
  const refs = [...ids].map((id) => db.doc(paths.reply(eventId, id)));
  const [list, snaps] = await Promise.all([
    tx.get(db.doc(paths.guestList(eventId))),
    refs.length > 0 ? tx.getAll(...refs) : [],
  ]);
  const cards = parseCards(
    replySchema,
    snaps.filter((snap) => snap.exists),
  );
  return {
    list: guestListOf(list),
    stored: new Map(cards.map((card) => [card.id, card])),
  };
}

/**
 * Saves the host's guest-list changes and what they change of the counters,
 * in one transaction. Only the replies the change can reach are counted
 * (`countsWithHostChange`); marking list names sent changes no counter, so
 * it writes the list alone. The list is saved from the version the page
 * read; reply cards have none, the last save wins. The reply cap stops the
 * host too (`refuseOverCap`). Returns the list's version and the event's
 * `dataVersion` after the save.
 */
export async function writeGuestChanges(
  hostId: string,
  eventId: string,
  changes: GuestChanges,
  now: Date,
): Promise<{ listVersion: number; dataVersion: number }> {
  return db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    const { list: listCard, stored } = await readChanged(
      tx,
      eventId,
      changes.replies,
    );
    /*
     * The list is saved whole, from the version the page read: else another
     * device got there first.
     */
    if (changes.list)
      expectVersion({ version: listCard.version }, changes.list.version);
    const list = changes.list && {
      names: changes.list.names,
      version: listCard.version + 1,
    };
    const replies = replyCards(
      changes.replies,
      stored,
      Timestamp.fromDate(now),
    ).map((card) =>
      withCheckedAnswers(card, resolveQuestions(doc.questions, doc.language)),
    );
    const questions = markAnswered(
      doc.questions,
      replies.flatMap((card) => [
        card.answers,
        ...card.people.map((person) => person.answers),
      ]),
    );
    const { remove } = changes.replies;
    /* Each card as it was stored, to come off the counters and summary as the cards now saved go on. */
    const change = {
      before: [...replies.map(({ id }) => id), ...remove].flatMap(
        (id) => stored.get(id) ?? [],
      ),
      after: replies,
      listBefore: listCard.names,
      listAfter: list?.names ?? listCard.names,
      remove,
    };
    refuseOverCap(doc, change.before, replies);
    const keys = affectedKeys(change);
    const counted =
      (keys.length > 0 || replies.length > 0 || remove.length > 0) &&
      (await countsWithHostChange(tx, eventId, doc, { ...change, keys }));

    /* Every read is done: the writes. */
    for (const { id, ...card } of replies)
      tx.set(replyRef(eventId, id, hostId), card);
    for (const id of remove) tx.delete(replyRef(eventId, id, hostId));
    if (list) tx.set(db.doc(paths.guestList(eventId)), list);
    const dataVersion = counted ? doc.dataVersion + 1 : doc.dataVersion;
    if (counted || questions)
      tx.update(ref, {
        ...(counted && {
          counts: counted,
          summary: summaryAfter(doc.summary, change.before, replies),
          dataVersion,
        }),
        ...(questions && { questions }),
      });

    return { listVersion: list?.version ?? listCard.version, dataVersion };
  });
}

/**
 * The guest page's list switch: the event's `preloaded` alone. The counters
 * keep both settings (`eventCounts`), so nothing is recounted. The version
 * goes up, as it's an Event settings field: a settings form open elsewhere is
 * told it's stale. No version check: it's one switch, not a form.
 */
export async function setGuestListOn(
  hostId: string,
  eventId: string,
  on: boolean,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    tx.update(ref, { preloaded: on, version: doc.version + 1 });
  });
}

/**
 * One pre-loaded name ticked sent or not: the list card alone, its version
 * raised (an editor open elsewhere is told it's stale). No counter changes.
 * Its own save, so it is counted apart from the others (`sent` in `hostSave`).
 * A name deleted on another device is refused as stale.
 */
export async function writeSentMark(
  hostId: string,
  eventId: string,
  { nameId, sent }: SentMark,
): Promise<{ listVersion: number }> {
  return db.runTransaction(async (tx) => {
    await ownEvent(tx, hostId, eventId);
    const ref = db.doc(paths.guestList(eventId));
    const list = guestListOf(await tx.get(ref));
    if (!list.names.some((name) => name.id === nameId))
      throw new SaveRefused("stale");
    const names = list.names.map((name) =>
      name.id === nameId ? { ...name, sent } : name,
    );
    const version = list.version + 1;
    tx.set(ref, { names, version });
    return { listVersion: version };
  });
}
