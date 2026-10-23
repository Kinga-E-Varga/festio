import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { loadHostEvents } from "@/db/reads/events";
import { redirect } from "@/i18n/navigation";
import { isArchived } from "@/lib/event";
import type { DashboardEvent } from "@/types/dashboard";

/*
 * Server reads, Admin SDK only: it skips the security rules, so access is
 * checked here. The one check: signed in, and it's *their* event. Every host
 * page about an event starts with it, and so does every Server Action that
 * changes one.
 */

/**
 * The signed-in host's event with this id, or null: unknown, or someone
 * else's. Found in the host's own events, read once per request (on dashboard
 * pages the layout has already read them). Signed out, the page goes to sign-in.
 */
export async function hostEvent(id: string): Promise<DashboardEvent | null> {
  const events = await loadHostEvents();
  return events.find((event) => event.id === id) ?? null;
}

/**
 * The event a host page is about. Unknown or not the host's, it is not found; past its
 * retention date the record is a stub with nothing to open, so it goes Home.
 */
export async function openEvent(id: string): Promise<DashboardEvent> {
  const event = await hostEvent(id);
  if (!event) notFound();
  if (isArchived(event)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }
  return event;
}

/** Each host page's tab title (a `Meta` key), and the one shown when the event isn't found. */
const TITLES = {
  event: "eventFallback",
  guests: "eventFallback",
  invitation: "invitationFallback",
  print: "printFallback",
} as const;

/** A host page's tab title, from its event's name. */
export async function eventMetadata(
  id: string,
  key: keyof typeof TITLES = "event",
): Promise<Metadata> {
  const event = await hostEvent(id);
  const t = await getTranslations("Meta");
  return { title: event ? t(key, { title: event.title }) : t(TITLES[key]) };
}
