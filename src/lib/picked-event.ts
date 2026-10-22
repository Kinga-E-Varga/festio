import { eventStatus, isArchived } from "@/lib/event";
import type { DashboardEvent, PickerEvent } from "@/types/dashboard";

/**
 * The event the host is working on, kept per browser until there are
 * accounts. Read on the server so the nav draws it straight away; written
 * only here, so moving it to the account later is one file.
 */
export const PICKED_EVENT_COOKIE = "festio-event";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function toPickerEvent(event: DashboardEvent): PickerEvent {
  return {
    id: event.id,
    title: event.title,
    date: event.date,
    countdown: event.countdown,
    status: eventStatus(event),
    archived: isArchived(event),
    hasDesign: Boolean(event.templateId),
    seatingAvailable: event.seatingAvailable,
    slug: event.slug,
  };
}

/**
 * The route's event first, then the one stored, then the soonest still
 * ahead. Expects the events soonest first; a stale or archived id falls
 * through.
 */
export function resolvePicked(
  events: PickerEvent[],
  routeId: string | undefined,
  storedId: string | undefined,
): PickerEvent | undefined {
  const find = (id: string | undefined) =>
    id ? events.find((event) => event.id === id && !event.archived) : undefined;
  return (
    find(routeId) ??
    find(storedId) ??
    events.find((event) => event.status !== "past")
  );
}

export function writePickedEvent(id: string): void {
  document.cookie = `${PICKED_EVENT_COOKIE}=${encodeURIComponent(id)}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}
