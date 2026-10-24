import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { slugDocSchema } from "@/db/schemas/slug";
import { SLUG_PATTERN } from "@/lib/slug";
import { requireHostId } from "@/db/reads/session";
import { parseCard } from "@/db/reads/parse";
import { readGuestList } from "@/db/reads/guests";
import { replyCloseAt, spanBetween, spanFrom, todayIn } from "@/lib/event";
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
    expectedGuests: doc.expectedGuests,
    needsAttention: doc.counts.needsAttention,
    waiting: doc.counts.waiting,
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
  };
}

function toView(id: string, data: unknown, now: Date): DashboardEvent | null {
  const doc = parseCard(eventSchema, paths.event(id), data);
  return doc ? toDashboardEvent(id, doc, now) : null;
}

/** Every event of the signed-in host, in no order: callers sort for their own list. */
export const loadHostEvents = cache(async (): Promise<DashboardEvent[]> => {
  await connection();
  const hostId = await requireHostId();
  const now = new Date();
  const snapshot = await db
    .collection(paths.events)
    .where("hostId", "==", hostId)
    .get();
  const events = snapshot.docs.map((doc) => toView(doc.id, doc.data(), now));
  return events.filter((event) => event !== null);
});

/** The event a guest link names, from its slug card alone: null for no such link or a blocked one. */
export async function eventIdBySlug(slug: string): Promise<string | null> {
  await connection();
  if (!SLUG_PATTERN.test(slug)) return null;
  const card = await db.doc(paths.slug(slug)).get();
  const link = parseCard(slugDocSchema, paths.slug(slug), card.data());
  return link && !link.blockedUntil ? link.eventId : null;
}

/**
 * The event a guest link points at, or null: no such link, a blocked link
 * (its event moved off it or its data went), an event that has since moved
 * to another link, or nothing left to show.
 */
export const loadEventBySlug = cache(
  async (slug: string): Promise<DashboardEvent | null> => {
    const eventId = await eventIdBySlug(slug);
    if (!eventId) return null;
    const snapshot = await db.doc(paths.event(eventId)).get();
    const event = toView(eventId, snapshot.data(), new Date());
    return event && event.slug === slug && !event.dataDeleted ? event : null;
  },
);

/** How many names the host pre-loaded. */
export async function guestListCount(event: DashboardEvent): Promise<number> {
  return (await readGuestList(event.id)).names.length;
}
