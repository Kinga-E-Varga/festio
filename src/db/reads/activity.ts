import { Timestamp } from "firebase-admin/firestore";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { feedTags, latestReplies, type LatestReply } from "@/db/reads/feed";
import { initials } from "@/db/reads/host";
import { requireHostId } from "@/db/reads/session";
import type { StoredReply } from "@/lib/guests";
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

/** The feed's rows in the query's order, each reply's tags worked out once per event. */
async function toFeed(
  latest: LatestReply[],
  events: DashboardEvent[],
): Promise<RsvpActivity[]> {
  const now = new Date();
  const shown = new Map<string, StoredReply[]>();
  for (const { eventId, reply } of latest)
    shown.set(eventId, [...(shown.get(eventId) ?? []), reply]);
  const byEvent = new Map(
    await Promise.all(
      events
        /* An archived event's replies went with its data; one that slipped in during the deletion stays out. */
        .filter((event) => shown.has(event.id) && !isArchived(event))
        .map(async (event) => {
          const replies = shown.get(event.id) ?? [];
          const tags = await feedTags(event.id, event.preloaded, replies);
          return [event.id, { event, tags }] as const;
        }),
    ),
  );
  return latest.flatMap(({ eventId, reply }) => {
    const found = byEvent.get(eventId);
    if (!found) return [];
    const tags = found.tags.get(reply.id) ?? [];
    return [toActivity(reply, found.event, tags, now)];
  });
}

/** The host's `limit` newest replies across these, their events, newest first. */
export async function loadRecentReplies(
  events: DashboardEvent[],
  limit: number,
): Promise<RsvpActivity[]> {
  await connection();
  const hostId = await requireHostId();
  return toFeed(await latestReplies({ hostId }, limit), events);
}

/** One event's `limit` newest replies, newest first: its Overview's. */
export async function loadEventReplies(
  event: DashboardEvent,
  limit: number,
): Promise<RsvpActivity[]> {
  await connection();
  return toFeed(await latestReplies({ eventId: event.id }, limit), [event]);
}
