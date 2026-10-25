import { Timestamp } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import { eventSchema, type Question } from "@/db/schemas/event";
import type {
  GuestPersonInput,
  GuestReplyInput,
  Person,
  ReplyDoc,
} from "@/db/schemas/reply";
import { unlockMatches } from "@/db/secret";
import { countsWithReply, readReplyGroup } from "@/db/writes/counts";
import { countAttempt, limitFor, readAttempts } from "@/db/writes/rate-limit";
import { replyRef } from "@/db/writes/reply-ref";
import { SaveRefused } from "@/db/writes/save";
import { GUEST_RULES, markAnswered } from "@/lib/answers";
import { checkedAnswers } from "@/db/writes/answers";
import { REPLY_LIMIT_PER_HOUR } from "@/lib/config";
import { replyCap, replyCloseAt } from "@/lib/event";
import { summaryAfter, type StoredReply } from "@/lib/guests";
import { newId } from "@/lib/id";
import { resolveQuestions } from "@/lib/suggested";

/** Who is replying, as the request tells: their scrambled IP, and the Protected cookie if any. */
export interface Visitor {
  key: string;
  unlock?: string;
}

/** One person as stored: a new permanent ID; answers (age and diet too) only when coming. */
function toPerson(
  person: GuestPersonInput,
  going: boolean,
  questions: Question[],
): Person {
  const { name } = person;
  if (!going) return { id: newId(), name };
  const answers = checkedAnswers(
    questions,
    "person",
    person.answers,
    GUEST_RULES,
  );
  return {
    id: newId(),
    name,
    ...(answers && { answers }),
  };
}

/**
 * Saves a guest's reply and adds what it changes to the counters, in one
 * transaction, so two guests at the same second are counted one after the
 * other. In order: the link still shows the invitation (still this event's
 * link, a template, not Hidden, Protected opened), replies are open, the
 * visitor is under the hour's limit, and the hidden cap isn't reached. A name
 * that already replied is saved like any other: the guest is never told who
 * replied, the guest list shows it as Duplicate. Only a saved reply counts
 * toward the limit.
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
    const [snap, attempts, existing] = await Promise.all([
      tx.get(ref),
      readAttempts(tx, limit),
      tx.get(db.doc(paths.reply(eventId, input.id))),
    ]);
    if (existing.exists) return;
    const doc = parseSnap(eventSchema, snap);
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
    if (doc.cancelled || now >= replyCloseAt(doc)) {
      throw new SaveRefused("closed");
    }
    if (attempts >= REPLY_LIMIT_PER_HOUR) throw new SaveRefused("tooMany");

    const { coming, notComing } = doc.counts;
    if (coming + notComing >= replyCap(doc.expectedGuests)) {
      throw new SaveRefused("paused");
    }

    const going = input.status === "going";
    const asked = resolveQuestions(doc.questions, doc.language);
    const answers = going
      ? checkedAnswers(asked, "reply", input.answers, GUEST_RULES)
      : undefined;
    const card: ReplyDoc = {
      sentAt: Timestamp.fromDate(now),
      status: input.status,
      message: input.message || null,
      ...(answers && { answers }),
      createdBy: "guest",
      people: input.people.map((person) => toPerson(person, going, asked)),
    };
    const questions = markAnswered(doc.questions, [
      card.answers,
      ...card.people.map((person) => person.answers),
    ]);
    const reply: StoredReply = { ...card, id: input.id };

    /* Only a reply that may be saved reads more: the cards its names can change. */
    const group = await readReplyGroup(tx, eventId, reply);
    tx.set(replyRef(eventId, input.id, doc.hostId), card);
    tx.update(ref, {
      counts: countsWithReply(doc.counts, group, reply, doc),
      summary: summaryAfter(doc.summary, [], [reply]),
      dataVersion: doc.dataVersion + 1,
      ...(questions && { questions }),
    });
    countAttempt(tx, limit, attempts, now);
  });
}
