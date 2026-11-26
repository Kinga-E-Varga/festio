import {
  Timestamp,
  type DocumentReference,
  type Transaction,
} from "firebase-admin/firestore";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseSnap } from "@/db/reads/parse";
import { rateLimitSchema, type RateLimitDoc } from "@/db/schemas/rate-limit";
import {
  HOST_SAVE_LIMIT_PER_HOUR,
  PASSWORD_LIMIT_PER_HOUR,
  SENT_MARK_LIMIT_PER_HOUR,
} from "@/lib/config";
import { HOUR_MS } from "@/lib/event";

/** One count of one kind of try, for one visitor on one link (or one host), in one hour. */
export interface Limit {
  ref: DocumentReference;
  action: RateLimitDoc["action"];
}

/** The hour `now` falls in, counted from 1970: one card per visitor, link and hour. */
function hourOf(now: Date): number {
  return Math.floor(now.getTime() / HOUR_MS);
}

/** The card for this kind of try, by whom (e.g. link and visitor), in this hour. */
export function limitFor(
  action: RateLimitDoc["action"],
  who: string[],
  now: Date,
): Limit {
  const key = [action, ...who, hourOf(now)].join("_");
  return { ref: db.doc(paths.rateLimit(key)), action };
}

/** How many tries the card has counted so far; none yet is 0. */
export async function readAttempts(
  tx: Transaction,
  limit: Limit,
): Promise<number> {
  return parseSnap(rateLimitSchema, await tx.get(limit.ref))?.count ?? 0;
}

/** Counts one more try. The card goes (TTL on `expiresAt`) when its hour ends. */
export function countAttempt(
  tx: Transaction,
  limit: Limit,
  count: number,
  now: Date,
): void {
  const card: RateLimitDoc = {
    action: limit.action,
    count: count + 1,
    expiresAt: Timestamp.fromMillis((hourOf(now) + 1) * HOUR_MS),
  };
  tx.set(limit.ref, card);
}

/**
 * One password try on a Protected invitation. Over the limit, even the right
 * password is turned away, so guessing can't go on. Only wrong ones count.
 */
export async function unlockAttempt(
  eventId: string,
  visitor: string,
  correct: boolean,
  now: Date,
): Promise<"ok" | "wrong" | "tooMany"> {
  return db.runTransaction(async (tx) => {
    const limit = limitFor("password", [eventId, visitor], now);
    const count = await readAttempts(tx, limit);
    if (count >= PASSWORD_LIMIT_PER_HOUR) return "tooMany";
    if (correct) return "ok";
    countAttempt(tx, limit, count, now);
    return "wrong";
  });
}

/** What a host's try is counted as: a save, or a sent tick (cheap, so more of them). */
export type HostLimit = "save" | "sent";

const HOST_LIMITS: Record<HostLimit, number> = {
  save: HOST_SAVE_LIMIT_PER_HOUR,
  sent: SENT_MARK_LIMIT_PER_HOUR,
};

/**
 * One host save (or sent tick), counted per account and hour before it runs.
 * Over the limit, it is turned away. Refused saves count too: a script trying
 * again and again is what this stops.
 */
export async function countHostSave(
  hostId: string,
  now: Date,
  kind: HostLimit = "save",
): Promise<"ok" | "tooMany"> {
  return db.runTransaction(async (tx) => {
    const limit = limitFor(kind, [hostId], now);
    const count = await readAttempts(tx, limit);
    if (count >= HOST_LIMITS[kind]) return "tooMany";
    countAttempt(tx, limit, count, now);
    return "ok";
  });
}
