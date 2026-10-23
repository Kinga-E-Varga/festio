import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { ownEvent } from "@/db/writes/event";
import { expectVersion } from "@/db/writes/save";

/**
 * Saves an invitation editor's card whole: checked against the version the
 * editor started from (a card not written yet is 0), then the next one.
 */
export async function writeInvitation(
  hostId: string,
  eventId: string,
  input: InvitationDoc,
): Promise<{ version: number }> {
  return db.runTransaction(async (tx) => {
    const ref = db.doc(paths.invitation(eventId));
    const [, snap] = await Promise.all([
      ownEvent(tx, hostId, eventId),
      tx.get(ref),
    ]);
    const stored = snap.exists
      ? (parseCard(invitationSchema, ref.path, snap.data()) ?? undefined)
      : undefined;
    expectVersion(stored, input.version);

    const version = (stored?.version ?? 0) + 1;
    tx.set(ref, { ...input, version });
    return { version };
  });
}
