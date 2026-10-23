import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import type { EventDoc } from "@/db/schemas/event";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { ownEvent } from "@/db/writes/event";
import { expectVersion } from "@/db/writes/save";

/**
 * Saves an invitation editor's card whole: checked against the version the
 * editor started from (a card not written yet is 0), then the next one.
 * `fit` shapes the card to the event's template as read in this transaction
 * (it throws to refuse), so a template changed meanwhile is never missed.
 */
export async function writeInvitation(
  hostId: string,
  eventId: string,
  fit: (event: EventDoc) => Promise<InvitationDoc>,
): Promise<{ version: number }> {
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
    tx.set(ref, { ...input, version });
    return { version };
  });
}
