import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { parseCards } from "@/db/reads/parse";
import { replySchema } from "@/db/schemas/reply";
import { DIRECT, readNameGroup } from "@/db/writes/counts";
import { replyKeys } from "@/db/writes/reply-ref";
import {
  buildRows,
  replyTags,
  toGuestReplies,
  type StoredReply,
} from "@/lib/guests";
import type { AttentionTag } from "@/types/guests";

/*
 * The latest replies' reads, without Next: a host's newest replies and their
 * tags, reading only what they need.
 */

export interface LatestReply {
  eventId: string;
  reply: StoredReply;
}

/**
 * The newest replies, newest first: across every event of a host in one
 * query (the card's `hostId`), or one event's. A deleted event's replies are
 * gone with its data, so none come back.
 */
export async function latestReplies(
  scope: { hostId: string } | { eventId: string },
  limit: number,
): Promise<LatestReply[]> {
  const replies =
    "hostId" in scope
      ? db.collectionGroup(paths.replyGroup).where("hostId", "==", scope.hostId)
      : db.collection(paths.replies(scope.eventId));
  const snapshot = await replies.orderBy("sentAt", "desc").limit(limit).get();
  /* Reply IDs are only unique within an event: each card keeps its own event. */
  return snapshot.docs.flatMap((doc) => {
    const eventId = doc.ref.parent.parent?.id;
    if (!eventId) return [];
    return parseCards(replySchema, [doc]).map((reply) => ({ eventId, reply }));
  });
}

/**
 * The Unknown / Duplicate tags of one event's `shown` replies, by reply ID,
 * from their names' group (`readNameGroup`) instead of every reply.
 */
export async function feedTags(
  eventId: string,
  preloaded: boolean,
  shown: StoredReply[],
): Promise<Map<string, AttentionTag[]>> {
  const nameKeys = [
    ...new Set(shown.flatMap((reply) => replyKeys(reply.people).nameKeys)),
  ];
  const group = await readNameGroup(DIRECT, eventId, nameKeys, preloaded);
  const rows = buildRows(
    {
      list: group.list,
      replies: toGuestReplies(group.replies),
      questions: [],
    },
    preloaded,
  );
  return new Map(
    shown.map((reply) => {
      const ids = new Set(reply.people.map((person) => person.id));
      return [reply.id, replyTags(rows.filter((row) => ids.has(row.id)))];
    }),
  );
}
