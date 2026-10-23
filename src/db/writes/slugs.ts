import { Timestamp, type Transaction } from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCard } from "@/db/reads/parse";
import { eventSchema } from "@/db/schemas/event";
import { slugDocSchema, type SlugDoc } from "@/db/schemas/slug";

/** Who wants a link, and when they ask. */
export interface SlugClaim {
  eventId: string;
  hostId: string;
  now: Date;
}

/**
 * Whether a link can go to this event. Free when nobody has it, when it is
 * already this event's, when it was blocked after one of this host's own
 * events moved off it, or when its block has run out. A live link of any
 * other event, even the same host's, is taken.
 */
export function slugFree(
  card: SlugDoc | null,
  cardHostId: string | null,
  claim: SlugClaim,
): boolean {
  if (!card) return true;
  if (!card.blockedUntil) return card.eventId === claim.eventId;
  return cardHostId === claim.hostId || card.blockedUntil.toDate() <= claim.now;
}

/**
 * Reads a link's card and, when it is blocked, its event's host, both
 * outside any write. The host of a link whose event card is gone is unknown.
 * Null when the card is there but can't be read: that link counts as taken.
 */
export async function readSlug(
  read: (path: string) => Promise<{ data(): unknown }>,
  slug: string,
): Promise<{ card: SlugDoc | null; hostId: string | null } | null> {
  const path = paths.slug(slug);
  const data = (await read(path)).data();
  if (data === undefined) return { card: null, hostId: null };
  const card = parseCard(slugDocSchema, path, data);
  if (!card) return null;
  if (!card.blockedUntil) return { card, hostId: null };
  const eventPath = paths.event(card.eventId);
  const event = parseCard(
    eventSchema,
    eventPath,
    (await read(eventPath)).data(),
  );
  return { card, hostId: event?.hostId ?? null };
}

/**
 * Reads whether a link is free inside a transaction. Free, it returns the
 * write that points the link at the event and clears any block; taken, null.
 */
export async function prepareClaim(
  tx: Transaction,
  slug: string,
  claim: SlugClaim,
): Promise<(() => void) | null> {
  const found = await readSlug((path) => tx.get(db.doc(path)), slug);
  if (!found || !slugFree(found.card, found.hostId, claim)) return null;
  return () => tx.set(db.doc(paths.slug(slug)), { eventId: claim.eventId });
}

/** Blocks a link until `until`; it still points to its event, so that host can take it back. */
export function blockSlug(tx: Transaction, slug: string, until: Date): void {
  tx.update(db.doc(paths.slug(slug)), {
    blockedUntil: Timestamp.fromDate(until),
  });
}
