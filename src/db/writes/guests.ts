import { Timestamp, type Transaction } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { GuestChanges } from "@/db/schemas/guest-changes";
import { parseCards } from "@/db/reads/parse";
import type { GuestListDoc } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import {
  affectedKeys,
  countsWithHostChange,
  guestListOf,
} from "@/db/writes/counts";
import { ownEvent } from "@/db/writes/event";
import { replyRef } from "@/db/writes/reply-ref";
import { expectVersion, SaveRefused } from "@/db/writes/save";
import { summaryAfter, type StoredReply } from "@/lib/guests";

/**
 * The reply cards to write. Replies keep when they came in and who sent
 * them. A card split off from another (`from`) takes that card's; a brand
 * new one is the host's. A card edited here but deleted on another device is
 * not brought back.
 */
function replyCards(
  replies: GuestChanges["replies"],
  stored: Map<string, StoredReply>,
  at: Timestamp,
): StoredReply[] {
  return replies.put.map(({ isNew, from, ...input }): StoredReply => {
    const own = stored.get(input.id);
    if (isNew ? own : !own) throw new SaveRefused("stale");
    if (!isNew && from) throw new SaveRefused("invalid");
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
 * read; reply cards have none, the last save wins. The host can always add
 * replies: no cap. Returns the list's version and the event's `dataVersion`
 * after the save.
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
    if (counted)
      tx.update(ref, {
        counts: counted,
        summary: summaryAfter(doc.summary, change.before, replies),
        dataVersion,
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
