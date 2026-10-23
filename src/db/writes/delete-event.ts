import { Timestamp } from "firebase-admin/firestore";
import { db, storage } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { slugDocSchema } from "@/db/schemas/slug";
import { SLUG_BLOCK_DAYS } from "@/lib/config";
import { addDays } from "@/lib/event";

/*
 * Deleting an event's data: the host's Delete now, and later the nightly
 * cleanup. It doesn't fit in one transaction, so it is ordered to be safe to
 * run again after a stop halfway.
 */

/** Everything under an event's card: invitation, replies, guest list, seating. */
function eventParts(eventId: string) {
  return [
    db.doc(paths.invitation(eventId)).parent,
    db.collection(paths.replies(eventId)),
    db.collection(paths.guestList(eventId)),
    db.doc(paths.seating(eventId)).parent,
  ];
}

/** The event's Storage folder: every image the host uploaded. Nothing there is fine. */
async function deleteUploads(eventId: string): Promise<void> {
  await storage.bucket().deleteFiles({ prefix: `events/${eventId}/` });
}

/**
 * What stays of an event card once its data is gone: enough to show it among
 * the host's past events. No guest data, password, questions, counts, print
 * settings or cancel message.
 */
export function leftoverEvent(doc: EventDoc): EventDoc {
  return {
    hostId: doc.hostId,
    title: doc.title,
    kind: doc.kind,
    language: doc.language,
    date: doc.date,
    timeZone: doc.timeZone,
    slug: doc.slug,
    visibility: "hidden",
    expectedGuests: doc.expectedGuests,
    preloaded: doc.preloaded,
    package: doc.package,
    templateId: doc.templateId,
    questions: [],
    counts: { coming: 0, notComing: 0, needsAttention: 0, seatingWarnings: 0 },
    dataDeleted: true,
    version: doc.version,
    createdAt: doc.createdAt,
  };
}

/**
 * Deletes a past or cancelled event's data. The parts go first, then the
 * uploads; **last**, in one transaction, the link is blocked for a while and
 * the card is stripped to its leftover. Stopped halfway, the card is still
 * whole, so running it again finishes the job. No host check: the caller
 * (an action, or the nightly job) has made it.
 */
export async function deleteEventData(
  eventId: string,
  now: Date,
): Promise<void> {
  const ref = db.doc(paths.event(eventId));
  const snap = await ref.get();
  if (!snap.exists) return;
  const doc = parseCard(eventSchema, ref.path, snap.data());
  if (!doc) throw new Error(`No readable event card at ${ref.path}.`);
  if (doc.dataDeleted) return;

  /* Each part goes on its own and can be run again, so all at once. */
  await Promise.all([
    ...eventParts(eventId).map((part) => db.recursiveDelete(part)),
    deleteUploads(eventId),
  ]);

  await db.runTransaction(async (tx) => {
    /* Read again: the card as it is now is the one stripped. */
    const fresh = parseCard(eventSchema, ref.path, (await tx.get(ref)).data());
    if (!fresh) throw new Error(`No readable event card at ${ref.path}.`);
    const slugRef = db.doc(paths.slug(fresh.slug));
    const data = (await tx.get(slugRef)).data();
    const link = data && parseCard(slugDocSchema, slugRef.path, data);
    /* Only this event's own link is blocked; one freed and taken since is left alone. */
    if (!link || link.eventId === eventId) {
      tx.set(slugRef, {
        eventId,
        blockedUntil: Timestamp.fromDate(addDays(now, SLUG_BLOCK_DAYS)),
      });
    }
    tx.set(ref, leftoverEvent(fresh));
  });
}
