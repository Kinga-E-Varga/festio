import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { slugDocSchema, type SlugDoc } from "@/db/schemas/slug";
import { SLUG_PATTERN } from "@/lib/slug";
import { requireHostId } from "@/db/reads/session";
import { parseCard } from "@/db/reads/parse";
import { readGuestList } from "@/db/reads/guests";
import { replyCloseAt, spanBetween, spanFrom, todayIn } from "@/lib/event";
import { shownCounts } from "@/lib/guests";
import { createMemo } from "@/lib/memo";
import { PACKAGES } from "@/lib/packages";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * An event card as the pages read it: plain values only, so it can go to a
 * client component, with everything that is worked out (countdown,
 * closes in) worked out against `now`.
 */
function toDashboardEvent(
  id: string,
  doc: EventDoc,
  now: Date,
): DashboardEvent {
  const today = new Date(`${todayIn(doc.timeZone, now)}T00:00`);
  return {
    id,
    title: doc.title,
    kind: doc.kind,
    date: doc.date,
    countdown: spanBetween(today, new Date(`${doc.date}T00:00`)),
    visibility: doc.visibility,
    package: doc.package,
    templateId: doc.templateId,
    language: doc.language,
    slug: doc.slug,
    password: doc.password,
    rsvp: {
      replied: doc.counts.coming + doc.counts.notComing,
      attending: doc.counts.coming,
      declined: doc.counts.notComing,
    },
    summary: doc.summary,
    expectedGuests: doc.expectedGuests,
    ...shownCounts(doc.counts, doc.preloaded),
    preloaded: doc.preloaded,
    questions: doc.questions,
    seatingAvailable: PACKAGES[doc.package].seating,
    repliesCloseAt: doc.repliesCloseAt,
    repliesCloseIn: spanFrom(now, replyCloseAt(doc)),
    dataDeleted: doc.dataDeleted,
    cancelled: Boolean(doc.cancelled),
    cancelMessage: doc.cancelled?.message,
    print: doc.print,
    version: doc.version,
    dataVersion: doc.dataVersion,
    invitationVersion: doc.invitationVersion,
  };
}

function toView(id: string, data: unknown, now: Date): DashboardEvent | null {
  const doc = parseCard(eventSchema, paths.event(id), data);
  return doc ? toDashboardEvent(id, doc, now) : null;
}

/** Every event of this host, in no order: for a Server Action, which has checked the host already. */
export async function eventsOfHost(hostId: string): Promise<DashboardEvent[]> {
  const now = new Date();
  const snapshot = await db
    .collection(paths.events)
    .where("hostId", "==", hostId)
    .get();
  const events = snapshot.docs.map((doc) => toView(doc.id, doc.data(), now));
  return events.filter((event) => event !== null);
}

/** Every event of the signed-in host, in no order: callers sort for their own list. */
export const loadHostEvents = cache(async (): Promise<DashboardEvent[]> => {
  await connection();
  return eventsOfHost(await requireHostId());
});

/** A guest link's card, read once per page: null for no such link, or a name that can't be one (no read). */
const slugCard = cache(async (slug: string): Promise<SlugDoc | null> => {
  await connection();
  if (!SLUG_PATTERN.test(slug)) return null;
  const card = await db.doc(paths.slug(slug)).get();
  /* No card is no such link, not a broken one: nothing to log. */
  if (!card.exists) return null;
  return parseCard(slugDocSchema, paths.slug(slug), card.data());
});

/** The event a guest link names, from its slug card alone: null for no such link or a blocked one. */
export async function eventIdBySlug(slug: string): Promise<string | null> {
  const link = await slugCard(slug);
  return link && !link.blockedUntil ? link.eventId : null;
}

/**
 * Whether a link that opens nothing is blocked because its event's data was
 * deleted: "no longer available" rather than "not found". The old link of a
 * renamed event is blocked too, but is simply not found.
 */
export async function linkGone(slug: string): Promise<boolean> {
  const link = await slugCard(slug);
  if (!link?.blockedUntil) return false;
  const event = await db.doc(paths.event(link.eventId)).get();
  return event.get("dataDeleted") === true;
}

/**
 * Guest link → event ID, for links found and not blocked whose event was
 * shown. This server's only: the event card is always read fresh and checked
 * against the link, so an entry another server made stale is never trusted.
 */
const eventIds = createMemo<string>();

/** The event card, read fresh, if it still has this link and its data. */
async function eventAtLink(
  eventId: string,
  slug: string,
): Promise<DashboardEvent | null> {
  const snapshot = await db.doc(paths.event(eventId)).get();
  const event = toView(eventId, snapshot.data(), new Date());
  return event && event.slug === slug && !event.dataDeleted ? event : null;
}

/**
 * The event a guest link points at, or null: no such link, a blocked link
 * (its event moved off it or its data went), an event that has since moved
 * to another link, or nothing left to show. The link's card is read only when
 * this server hasn't kept it, or what it kept no longer matches.
 */
export const loadEventBySlug = cache(
  async (slug: string): Promise<DashboardEvent | null> => {
    await connection();
    const kept = eventIds.get(slug);
    if (kept !== undefined) {
      const event = await eventAtLink(kept, slug);
      if (event) return event;
      eventIds.delete(slug);
    }
    const eventId = await eventIdBySlug(slug);
    if (!eventId) return null;
    const event = await eventAtLink(eventId, slug);
    if (event) eventIds.set(slug, eventId);
    return event;
  },
);

/** How many names the host pre-loaded. */
export async function guestListCount(event: DashboardEvent): Promise<number> {
  return (await readGuestList(event.id)).names.length;
}
