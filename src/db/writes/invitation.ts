import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import type { EventDoc, Question, QuestionInput } from "@/db/schemas/event";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { ownEvent } from "@/db/writes/event";
import { expectVersion } from "@/db/writes/save";
import { mergeQuestions } from "@/lib/questions";

/**
 * Saves an invitation editor's card whole: checked against the version the
 * editor started from (a card not written yet is 0), then the next one.
 * `fit` shapes the card to the event's template as read in this transaction
 * (it throws to refuse), so a template changed meanwhile is never missed.
 * The event card's `invitationVersion` follows the new version.
 *
 * A modular editor sends its reply questions too: merged with the stored
 * ones (`mergeQuestions`, so one answered meanwhile is kept) onto the event
 * card in the same update. Its `version` stays: the questions are the
 * invitation's, not Event settings'. Returns the questions as saved, and
 * the ones kept against the host's change.
 */
export async function writeInvitation(
  hostId: string,
  eventId: string,
  fit: (event: EventDoc) => Promise<InvitationDoc>,
  questions?: QuestionInput[],
): Promise<{ version: number; questions: Question[]; kept: string[] }> {
  return db.runTransaction(async (tx) => {
    const ref = db.doc(paths.invitation(eventId));
    const [{ doc: event }, snap] = await Promise.all([
      ownEvent(tx, hostId, eventId),
      tx.get(ref),
    ]);
    const input = await fit(event);
    const stored = parseSnap(invitationSchema, snap);
    expectVersion(stored, input.version);

    const version = (stored?.version ?? 0) + 1;
    const merged = questions
      ? mergeQuestions(event.questions, questions)
      : { questions: event.questions, kept: [] };
    tx.set(ref, { ...input, version });
    /* The guest page caches the invitation under this, so it never shows an older one. */
    tx.update(db.doc(paths.event(eventId)), {
      invitationVersion: version,
      ...(questions && { questions: merged.questions }),
    });
    return { version, ...merged };
  });
}
