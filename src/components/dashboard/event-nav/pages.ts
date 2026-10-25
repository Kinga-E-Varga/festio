import { eventPath, invitationUrl } from "@/lib/event";
import { toPickerEvent } from "@/lib/picked-event";
import type { DashboardEvent, IconName, PickerEvent } from "@/types/dashboard";

export type EventPageKey =
  | "overview"
  | "details"
  | "invitation"
  | "guests"
  | "seating"
  | "print"
  | "guestView";

export interface EventPageLink {
  key: EventPageKey;
  icon: IconName;
  /** Absent on a page that doesn't exist yet. */
  href?: string;
  /** Opens in a tab of its own: the guest page. */
  external?: boolean;
  /** Set when the page can't be opened: the full message key of the reason. */
  disabledKey?: string;
}

/**
 * The picked event's pages, in the nav's order, each greyed for the same
 * reasons its button was on the old events list: an event without a design
 * has nothing to edit, print or show; a past one can't be edited.
 */
export function eventPages(event: PickerEvent): EventPageLink[] {
  const past = event.status === "past";
  const noDesign = event.hasDesign ? undefined : "Event.noDesign";

  return [
    { key: "overview", icon: "calendar", href: eventPath(event.id) },
    {
      key: "details",
      icon: "pencil",
      href: eventPath(event.id, "details"),
      disabledKey: past ? "Event.alreadyHappened" : undefined,
    },
    { key: "guests", icon: "guests", href: eventPath(event.id, "guests") },
    {
      key: "seating",
      icon: "seating",
      disabledKey: event.seatingAvailable
        ? "Nav.comingSoon"
        : "Event.seatingPaidOnly",
    },
    {
      key: "invitation",
      icon: "layers",
      href: `/invitations/${event.id}`,
      disabledKey: past ? "Event.alreadyHappened" : noDesign,
    },
    {
      key: "print",
      icon: "printer",
      href: `/prints/${event.id}`,
      disabledKey: noDesign,
    },
    {
      key: "guestView",
      icon: "eye",
      href: invitationUrl(event),
      external: true,
      disabledKey: noDesign,
    },
  ];
}

/** Where a page opens, or nothing while it can't: no page yet, or greyed. */
export function openHref(page: EventPageLink | undefined): string | undefined {
  return page?.disabledKey ? undefined : page?.href;
}

/** One of a dashboard event's pages, as the nav would show it. */
export function eventPage(
  event: DashboardEvent,
  key: EventPageKey,
): EventPageLink | undefined {
  return eventPages(toPickerEvent(event)).find((page) => page.key === key);
}

/** The pages under an event's Overview that switching events can keep. */
const KEPT_PAGES: EventPageKey[] = ["details", "guests"];

/**
 * Where picking `next` goes from `pathname`: the same page for the new
 * event when it is one that can be kept and is open to it; else its Overview.
 */
export function switchHref(pathname: string, next: PickerEvent): string {
  const sub = pathname.match(/^\/dashboard\/events\/[^/]+\/([^/]+)/)?.[1];
  const page = eventPages(next).find(
    (link) => link.key === sub && KEPT_PAGES.includes(link.key),
  );
  return openHref(page) ?? eventPath(next.id);
}
