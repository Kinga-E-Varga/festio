import { Timestamp } from "firebase-admin/firestore";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { loadGuestRows } from "@/db/reads/guests";
import { parseCards } from "@/db/reads/parse";
import { replySchema } from "@/db/schemas/reply";
import { initials } from "@/db/reads/host";
import { replyTags, type StoredReply } from "@/lib/guests";
import { isArchived, shortTitle, spanFrom } from "@/lib/event";
import type { DashboardEvent, Message, RsvpActivity } from "@/types/dashboard";
import type { AttentionTag } from "@/types/guests";

/** The needs the latest replies name, by their key in `Activity`. */
const NAMED_DIETS = ["vegetarian", "glutenFree"] as const;

/** What a coming reply is worth knowing about: children, and the needs `Activity` names. */
function details(reply: StoredReply): Message[] {
  const children = reply.people.filter(
    (person) => person.ageGroup === "child",
  ).length;
  return [
    ...(children > 0 ? [{ key: "children", values: { count: children } }] : []),
    ...NAMED_DIETS.filter((need) =>
      reply.people.some((person) => person.diet?.includes(need)),
    ).map((key) => ({ key })),
  ];
}

/** One reply as the latest replies read it. */
function toActivity(
  reply: StoredReply,
  event: DashboardEvent,
  tags: AttentionTag[],
  now: Date,
): RsvpActivity {
  const [first] = reply.people;
  const base = {
    id: `${event.id}-${reply.id}`,
    eventId: event.id,
    event: shortTitle(event),
    when: spanFrom(now, reply.sentAt.toDate()),
    tags,
  };
  /* Added by the host: the sentence names "you", and the guest as its subject. */
  if (reply.createdBy === "host") {
    return {
      ...base,
      initials: "",
      action: { key: "phoneRsvp", values: { subject: first.name } },
      details: [{ key: "addedByHost" }],
    };
  }
  const going = reply.status === "going";
  return {
    ...base,
    initials: initials(first.name),
    actor: first.name,
    action: !going
      ? { key: "declined" }
      : reply.people.length > 1
        ? { key: "attendingWith", values: { others: reply.people.length - 1 } }
        : { key: "replied" },
    details: going ? details(reply) : [],
  };
}

/**
 * How many replies guests sent after `since` (never = all of them), across
 * these events. Host-added replies don't count. Archived events have none left.
 */
export async function newReplyCount(
  events: DashboardEvent[],
  since: Date | undefined,
): Promise<number> {
  const counts = await Promise.all(
    events
      .filter((event) => !isArchived(event))
      .map(async (event) => {
        const guestReplies = db
          .collection(paths.replies(event.id))
          .where("createdBy", "==", "guest");
        const query = since
          ? guestReplies.where("sentAt", ">", Timestamp.fromDate(since))
          : guestReplies;
        return (await query.count().get()).data().count;
      }),
  );
  return counts.reduce((sum, count) => sum + count, 0);
}

/**
 * The newest replies across these events, newest first: `limit` from each
 * event, then cut to `limit` in all. Archived events have none left. Only the
 * events still in the list read their guest list, for the tags.
 */
export async function loadRecentReplies(
  events: DashboardEvent[],
  limit: number,
): Promise<RsvpActivity[]> {
  await connection();
  const now = new Date();
  const lists = await Promise.all(
    events
      .filter((event) => !isArchived(event))
      .map(async (event) => {
        const snapshot = await db
          .collection(paths.replies(event.id))
          .orderBy("sentAt", "desc")
          .limit(limit)
          .get();
        return parseCards(replySchema, snapshot.docs).map((reply) => ({
          at: reply.sentAt.toDate().getTime(),
          reply,
          event,
        }));
      }),
  );
  const latest = lists
    .flat()
    .sort((first, second) => second.at - first.at)
    .slice(0, limit);
  /* Each event's rows are built once (`loadGuestRows`), however many of its replies show. */
  return Promise.all(
    latest.map(async ({ reply, event }) => {
      const ids = new Set(reply.people.map((person) => person.id));
      const people = (await loadGuestRows(event)).filter((row) =>
        ids.has(row.id),
      );
      return toActivity(reply, event, replyTags(people), now);
    }),
  );
}
