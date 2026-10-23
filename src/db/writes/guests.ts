import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { idSchema, versionSchema } from "@/db/schemas/common";
import { guestListNameSchema } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";
import { countsOf, readCountInputs } from "@/db/writes/counts";
import { ownEvent } from "@/db/writes/event";
import { expectVersion, SaveRefused } from "@/db/writes/save";
import type { StoredReply } from "@/lib/guests";
import type { GuestChanges } from "@/types/guests";

/** A reply card as the host sends it: the server sets when, by whom and the edit time. */
const replyInputSchema = replySchema
  .omit({ sentAt: true, createdBy: true, editedAt: true })
  .extend({ id: idSchema, isNew: z.boolean(), from: idSchema.optional() });

const listNameInputSchema = guestListNameSchema.extend({
  id: idSchema,
  isNew: z.boolean(),
});

/** One guest-list save, checked before anything is read. */
export const guestChangesSchema = z.object({
  replies: z.object({
    put: z.array(replyInputSchema),
    remove: z.array(idSchema),
  }),
  list: z.object({
    put: z.array(listNameInputSchema),
    remove: z.array(z.object({ id: idSchema, version: versionSchema })),
  }),
});

/**
 * Saves the host's guest-list changes and recounts the event, in one
 * transaction. Names are saved from the version the page read; reply cards
 * have none, the last save wins. The host can always add replies: no cap.
 * Returns each saved name's new version.
 */
export async function writeGuestChanges(
  hostId: string,
  eventId: string,
  changes: GuestChanges,
  now: Date,
): Promise<{ versions: Record<string, number> }> {
  return db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    /* Only a leftover is kept once the data is deleted: nothing left to edit. */
    const inputs = await readCountInputs(tx, eventId);

    /*
     * Names: a new one must not exist yet; any other must still be there, at
     * the version the page read. Otherwise another device got there first.
     */
    const names = new Map(inputs.list.map((name) => [name.id, name]));
    for (const { id, isNew, version } of changes.list.put) {
      const card = names.get(id);
      if (isNew ? card : !card) throw new SaveRefused("stale");
      if (card) expectVersion(card, version);
    }
    for (const { id, version } of changes.list.remove) {
      const card = names.get(id);
      if (!card) throw new SaveRefused("stale");
      expectVersion(card, version);
    }

    /*
     * Replies keep when they came in and who sent them. A card split off
     * from another (`from`) takes that card's; a brand new one is the host's.
     * A card edited here but deleted on another device is not brought back.
     */
    const stored = new Map(inputs.replies.map((reply) => [reply.id, reply]));
    const at = Timestamp.fromDate(now);
    const written = changes.replies.put.map(
      ({ isNew, from, ...input }): StoredReply => {
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
      },
    );
    const savedNames = changes.list.put.map(({ id, name, sent }) => ({
      id,
      name,
      sent,
      version: (names.get(id)?.version ?? 0) + 1,
    }));

    /* Every read is done: the writes. */
    for (const { id, ...card } of written)
      tx.set(db.doc(paths.reply(eventId, id)), card);
    for (const id of changes.replies.remove)
      tx.delete(db.doc(paths.reply(eventId, id)));
    for (const { id, ...card } of savedNames)
      tx.set(db.doc(paths.listName(eventId, id)), card);
    for (const { id } of changes.list.remove)
      tx.delete(db.doc(paths.listName(eventId, id)));

    /* The counters over the cards as they now stand. */
    for (const id of changes.replies.remove) stored.delete(id);
    for (const reply of written) stored.set(reply.id, reply);
    for (const { id } of changes.list.remove) names.delete(id);
    for (const name of savedNames) names.set(name.id, name);
    const counts = countsOf(
      {
        replies: [...stored.values()],
        list: [...names.values()],
        seatedIds: inputs.seatedIds,
      },
      doc,
    );
    tx.update(ref, { counts });

    return {
      versions: Object.fromEntries(
        savedNames.map(({ id, version }) => [id, version]),
      ),
    };
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
