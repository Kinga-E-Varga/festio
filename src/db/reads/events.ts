import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/db/admin";
import { paths } from "@/db/paths";
import { eventSchema, type EventDoc } from "@/db/schemas/event";
import { slugDocSchema } from "@/db/schemas/slug";
import { SLUG_PATTERN } from "@/lib/slug";
import { DEV_HOST_ID } from "@/db/reads/host";
import { parseCard } from "@/db/reads/parse";
import { replyClose, spanBetween, spanFrom, todayIn } from "@/lib/event";
import { covers, PACKAGES } from "@/lib/packages";
import { loadTemplate } from "@/templates";
import type { DashboardEvent, PackageId } from "@/types/dashboard";

/**
 * An event card as the pages read it: plain values only, so it can go to a
 * client component, with everything that is worked out (countdown, paid,
 * closes in) worked out against `now`.
 */
function toDashboardEvent(
  id: string,
  doc: EventDoc,
  templatePackage: PackageId | undefined,
  now: Date,
): DashboardEvent {
  const needed =
    templatePackage && !covers(doc.package, templatePackage)
      ? templatePackage
      : doc.package;
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
    neededPackage: needed,
    language: doc.language,
    paid: needed === doc.package,
    slug: doc.slug,
    password: doc.password,
    rsvp: {
      replied: doc.counts.coming + doc.counts.notComing,
      attending: doc.counts.coming,
      declined: doc.counts.notComing,
    },
    expectedGuests: doc.expectedGuests,
    needsAttention: doc.counts.needsAttention,
    preloaded: doc.preloaded,
    questions: doc.questions,
    seatingAvailable: PACKAGES[doc.package].seating,
    repliesCloseAt: doc.repliesCloseAt,
    repliesCloseIn: spanFrom(now, replyClose(doc)),
    dataDeleted: doc.dataDeleted,
    cancelled: Boolean(doc.cancelled),
  };
}

/**
 * True when `id` can name a Firestore card. An id from a URL that can't
 * (`a/b`, `..`, `__x__`) would make Firestore throw; it reads as no event.
 */
function isCardId(id: string): boolean {
  return (
    id.length > 0 &&
    id.length <= 1500 &&
    !id.includes("/") &&
    id !== "." &&
    id !== ".." &&
    !/^__.*__$/.test(id)
  );
}

async function toView(
  id: string,
  data: unknown,
  now: Date,
): Promise<DashboardEvent | null> {
  const doc = parseCard(eventSchema, paths.event(id), data);
  if (!doc) return null;
  const template = doc.templateId
    ? await loadTemplate(doc.templateId)
    : undefined;
  return toDashboardEvent(id, doc, template?.template.package, now);
}

/** Every event of the host, in no order: callers sort for their own list. */
export const loadHostEvents = cache(async (): Promise<DashboardEvent[]> => {
  await connection();
  const now = new Date();
  const snapshot = await db
    .collection(paths.events)
    .where("hostId", "==", DEV_HOST_ID)
    .get();
  const events = await Promise.all(
    snapshot.docs.map((doc) => toView(doc.id, doc.data(), now)),
  );
  return events.filter((event) => event !== null);
});

/** One of the host's events, or null: missing, someone else's, or unreadable. */
export const loadEvent = cache(
  async (id: string): Promise<DashboardEvent | null> => {
    await connection();
    if (!isCardId(id)) return null;
    const snapshot = await db.doc(paths.event(id)).get();
    if (snapshot.get("hostId") !== DEV_HOST_ID) return null;
    return toView(id, snapshot.data(), new Date());
  },
);

/**
 * The event a guest link points at, or null: no such link, a link still
 * blocked after its event's data went, or nothing left to show.
 */
export const loadEventBySlug = cache(
  async (slug: string): Promise<DashboardEvent | null> => {
    await connection();
    if (!SLUG_PATTERN.test(slug)) return null;
    const card = await db.doc(paths.slug(slug)).get();
    const link = parseCard(slugDocSchema, paths.slug(slug), card.data());
    if (!link || link.blockedUntil) return null;
    const { eventId } = link;
    const snapshot = await db.doc(paths.event(eventId)).get();
    const event = await toView(eventId, snapshot.data(), new Date());
    return event && !event.dataDeleted ? event : null;
  },
);

/** How many names the host pre-loaded, counted by Firestore, not read. */
export async function guestListCount(eventId: string): Promise<number> {
  await connection();
  const snapshot = await db.collection(paths.guestList(eventId)).count().get();
  return snapshot.data().count;
}
