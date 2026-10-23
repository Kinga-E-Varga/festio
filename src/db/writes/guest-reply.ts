import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { eventSchema } from "@/db/schemas/event";
import type {
  GuestPersonInput,
  GuestReplyInput,
  Person,
  ReplyDoc,
} from "@/db/schemas/reply";
import { unlockMatches } from "@/db/secret";
import { countsAfter, countsOf, readCountInputs } from "@/db/writes/counts";
import { countAttempt, limitFor, readAttempts } from "@/db/writes/rate-limit";
import { SaveRefused } from "@/db/writes/save";
import { REPLY_LIMIT_PER_HOUR } from "@/lib/config";
import { replyCap, replyClose } from "@/lib/event";
import type { StoredReply } from "@/lib/guests";
import { newId } from "@/lib/id";

/** Who is replying, as the request tells: their scrambled IP, and the Protected cookie if any. */
export interface Visitor {
  key: string;
  unlock?: string;
}

/** One person as stored: a new permanent ID; age and diet only when coming. */
function toPerson(person: GuestPersonInput, going: boolean): Person {
  const { name, ageGroup, diet, dietOther } = person;
  if (!going) return { id: newId(), name };
  return {
    id: newId(),
    name,
    ...(ageGroup && { ageGroup }),
    /* Each need once, whatever was sent. */
    ...(diet && { diet: [...new Set(diet)] }),
    ...(diet?.includes("other") && dietOther && { dietOther }),
  };
}

/**
 * Saves a guest's reply and recounts the event, in one transaction, so two
 * guests at the same second are counted one after the other. In order: the
 * link still shows the invitation (still this event's link, a template, not
 * Hidden, Protected opened), replies are open, the visitor is under the
 * hour's limit, and the hidden cap isn't reached. A name that already replied
 * is saved like any other: the guest is never told who replied, the guest
 * list shows it as Duplicate. Only a saved reply counts toward the limit.
 *
 * The form makes the reply's ID once, so the same reply sent twice (a
 * connection that retried) is saved once: the second finds it and stops.
 */
export async function writeGuestReply(
  eventId: string,
  slug: string,
  input: GuestReplyInput,
  visitor: Visitor,
  now: Date,
): Promise<void> {
  await db.runTransaction(async (tx) => {
    const ref = db.doc(paths.event(eventId));
    const limit = limitFor("reply", eventId, visitor.key, now);
    const replyRef = db.doc(paths.reply(eventId, input.id));
    const [snap, attempts, existing] = await Promise.all([
      tx.get(ref),
      readAttempts(tx, limit),
      tx.get(replyRef),
    ]);
    if (existing.exists) return;
    const doc = snap.exists
      ? parseCard(eventSchema, ref.path, snap.data())
      : null;
    if (
      !doc ||
      doc.dataDeleted ||
      doc.visibility === "hidden" ||
      doc.slug !== slug ||
      !doc.templateId
    ) {
      throw new SaveRefused("notFound");
    }
    if (
      doc.visibility === "protected" &&
      !unlockMatches(visitor.unlock, eventId, doc.password)
    ) {
      throw new SaveRefused("locked");
    }
    if (doc.cancelled || now >= replyClose(doc)) {
      throw new SaveRefused("closed");
    }
    if (attempts >= REPLY_LIMIT_PER_HOUR) throw new SaveRefused("tooMany");

    /* Only a reply that may be saved reads every card: a refused one costs two reads. */
    const inputs = await readCountInputs(tx, eventId);
    const counts = countsOf(inputs, doc);
    if (counts.coming + counts.notComing >= replyCap(doc.expectedGuests)) {
      throw new SaveRefused("paused");
    }

    const going = input.status === "going";
    const card: ReplyDoc = {
      sentAt: Timestamp.fromDate(now),
      status: input.status,
      message: input.message || null,
      createdBy: "guest",
      people: input.people.map((person) => toPerson(person, going)),
    };
    const reply: StoredReply = { ...card, id: input.id };

    tx.set(replyRef, card);
    tx.update(ref, {
      counts: countsAfter(inputs, { put: [reply], remove: [] }, doc),
    });
    countAttempt(tx, limit, attempts, now);
  });
}
