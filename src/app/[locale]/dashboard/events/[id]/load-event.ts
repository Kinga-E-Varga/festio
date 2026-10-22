import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { isArchived } from "@/lib/event";
import { findEvent } from "@/mock/dashboard";
import type { DashboardEvent } from "@/types/dashboard";

/**
 * The event an event page is about. Unknown, it is not found; past its
 * retention date the record is a stub with nothing to open, so it goes Home.
 */
export async function openEvent(id: string): Promise<DashboardEvent> {
  const event = findEvent(id);
  if (!event) notFound();
  if (isArchived(event)) {
    redirect({ href: "/dashboard", locale: await getLocale() });
  }
  return event;
}

/** An event page's tab title, from the event's name. */
export async function eventMetadata(
  id: string,
  key: "event" | "guests" = "event",
): Promise<Metadata> {
  const event = findEvent(id);
  const t = await getTranslations("Meta");
  return {
    title: event ? t(key, { title: event.title }) : t("eventFallback"),
  };
}
