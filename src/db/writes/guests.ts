import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import type { GuestChanges } from "@/db/schemas/guest-changes";
import { countsAfter, countsOf, readCountInputs } from "@/db/writes/counts";
import { ownEvent } from "@/db/writes/event";
import { replyRef } from "@/db/writes/reply-ref";
import { expectVersion, SaveRefused } from "@/db/writes/save";
import type { StoredReply } from "@/lib/guests";

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
 * Saves the host's guest-list changes and recounts the event, in one
 * transaction. The list is saved from the version the page read; reply cards
 * have none, the last save wins. The host can always add replies: no cap.
 * Returns the list's version after the save.
 */
export async function writeGuestChanges(
  hostId: string,
  eventId: string,
  changes: GuestChanges,
  now: Date,
): Promise<{ listVersion: number }> {
  return db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    const inputs = await readCountInputs(tx, eventId);
    /* The list is saved whole, from the version the page read: otherwise another device got there first. */
    if (changes.list)
      expectVersion({ version: inputs.listVersion }, changes.list.version);
    const list = changes.list && {
      names: changes.list.names,
      version: inputs.listVersion + 1,
    };
    const replies = replyCards(
      changes.replies,
      new Map(inputs.replies.map((reply) => [reply.id, reply])),
      Timestamp.fromDate(now),
    );

    /* Every read is done: the writes. */
    for (const { id, ...card } of replies) tx.set(replyRef(eventId, id), card);
    for (const id of changes.replies.remove) tx.delete(replyRef(eventId, id));
    if (list) tx.set(db.doc(paths.guestList(eventId)), list);

    const counts = countsAfter(
      { ...inputs, list: list?.names ?? inputs.list },
      { put: replies, remove: changes.replies.remove },
      doc,
    );
    tx.update(ref, { counts });

    return { listVersion: list?.version ?? inputs.listVersion };
  });
}

/**
 * The guest page's list switch: the event's `preloaded`, recounted with it.
 * The version goes up, as it's an Event settings field: a settings form open
 * elsewhere is told it's stale. No version check: it's one switch, not a form.
 */
export async function setGuestListOn(
  hostId: string,
  eventId: string,
  on: boolean,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    const inputs = await readCountInputs(tx, eventId);
    tx.update(ref, {
      preloaded: on,
      counts: countsOf(inputs, { preloaded: on, questions: doc.questions }),
      version: doc.version + 1,
    });
  });
}
