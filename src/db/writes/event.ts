import {
  FieldValue,
  Timestamp,
  type DocumentReference,
  type DocumentSnapshot,
  type Transaction,
} from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import {
  eventSchema,
  type EventDoc,
  type EventSettings,
} from "@/db/schemas/event";
import type { PrintSettings } from "@/types/print";
import { countsOf, readCountInputs } from "@/db/writes/counts";
import { expectVersion, SaveRefused } from "@/db/writes/save";
import { blockSlug, prepareClaim } from "@/db/writes/slugs";
import { SLUG_BLOCK_DAYS } from "@/lib/config";
import { addDays, defaultReplyClose, todayIn } from "@/lib/event";

/**
 * The host's own event card, read inside a transaction. Missing, failing its
 * schema or someone else's, the save stops as not found; a leftover whose
 * data is deleted can't be changed at all. Every host save starts here.
 */
export async function ownEvent(
  tx: Transaction,
  hostId: string,
  eventId: string,
): Promise<{ ref: DocumentReference; doc: EventDoc }> {
  const ref = db.doc(paths.event(eventId));
  return { ref, doc: ownedCard(await tx.get(ref), hostId) };
}

/**
 * The same card, read plainly, for an action that needs one of its fields
 * before its save (the link check, the invitation's template). The save's
 * own `ownEvent` still checks it again inside its transaction.
 */
export async function readOwnEvent(
  hostId: string,
  eventId: string,
): Promise<EventDoc> {
  return ownedCard(await db.doc(paths.event(eventId)).get(), hostId);
}

function ownedCard(snap: DocumentSnapshot, hostId: string): EventDoc {
  const doc = parseSnap(eventSchema, snap);
  if (!doc || doc.hostId !== hostId) throw new SaveRefused("notFound");
  if (doc.dataDeleted) throw new SaveRefused("notAllowed");
  return doc;
}

/**
 * Saves Event settings: the rules the form shows, checked again on the
 * event's own clock, then the ten fields and the next version.
 */
export async function writeEventSettings(
  hostId: string,
  eventId: string,
  input: EventSettings,
  now: Date,
): Promise<{ version: number }> {
  return db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    expectVersion(doc, input.version);
    /* Only a leftover is kept once the data is deleted: nothing left to edit. */

    /* From the event day on, the date stays put. */
    const locked = todayIn(doc.timeZone, now) >= doc.date;
    if (locked && input.date !== doc.date) throw new SaveRefused("dateLocked");
    /* Replies may pass the number and it can always go up; it just can't be lowered below them. */
    const replied = doc.counts.coming + doc.counts.notComing;
    if (
      input.expectedGuests < doc.expectedGuests &&
      input.expectedGuests < replied
    ) {
      throw new SaveRefused("expectedTooLow");
    }
    if (
      input.repliesCloseAt &&
      new Date(input.repliesCloseAt) > defaultReplyClose(input.date)
    ) {
      throw new SaveRefused("closeTooLate");
    }

    /*
     * The list switch changes which names need sorting out: recount with it.
     * A new link is claimed; the old one stays blocked for a while, still
     * this event's. The two reads don't depend on each other.
     */
    const [recount, claim] = await Promise.all([
      input.preloaded !== doc.preloaded ? readCountInputs(tx, eventId) : null,
      input.slug !== doc.slug
        ? prepareClaim(tx, input.slug, { eventId, hostId, now })
        : undefined,
    ]);
    if (claim === null) throw new SaveRefused("slugTaken");
    if (claim) {
      claim();
      blockSlug(tx, doc.slug, addDays(now, SLUG_BLOCK_DAYS));
    }

    const version = doc.version + 1;
    tx.update(ref, {
      title: input.title,
      kind: input.kind,
      language: input.language,
      date: input.date,
      repliesCloseAt: input.repliesCloseAt ?? FieldValue.delete(),
      slug: input.slug,
      visibility: input.visibility,
      password: input.password ?? FieldValue.delete(),
      expectedGuests: input.expectedGuests,
      preloaded: input.preloaded,
      ...(recount && {
        counts: countsOf(recount, {
          preloaded: input.preloaded,
          questions: doc.questions,
        }),
      }),
      version,
    });
    return { version };
  });
}

/**
 * Cancels an event: its invitation shows the host's message instead, and
 * replies close. A form-free action, so the version stays as it is.
 */
export async function writeCancel(
  hostId: string,
  eventId: string,
  message: string,
  now: Date,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    if (doc.cancelled) throw new SaveRefused("notAllowed");
    tx.update(ref, {
      cancelled: { message, at: Timestamp.fromDate(now) },
    });
  });
}

/** Takes a cancel back while the data is still there: the invitation and replies open again. */
export async function writeReopen(
  hostId: string,
  eventId: string,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const { ref, doc } = await ownEvent(tx, hostId, eventId);
    if (!doc.cancelled) throw new SaveRefused("notAllowed");
    tx.update(ref, { cancelled: FieldValue.delete() });
  });
}

/**
 * Keeps the printable's settings on the event card, so the print page opens
 * on them. No version: the print form is the only one that writes this field.
 */
export async function writePrintSettings(
  hostId: string,
  eventId: string,
  print: PrintSettings,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const { ref } = await ownEvent(tx, hostId, eventId);
    tx.update(ref, { print });
  });
}
