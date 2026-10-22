import { useLocale, useTranslations } from "next-intl";
import {
  countdownNow,
  defaultReplyClose,
  deletionDate,
  eventPath,
  floodReportPath,
  formatDeadline,
  formatDuration,
  isPast,
  replyClose,
  replyWindow,
  repliesPaused,
} from "@/lib/event";
import { buildRows, countRows } from "@/lib/guests";
import { ATTENTION_NOTICES, PACKAGES, shortTitle } from "@/mock/dashboard";
import { findGuests } from "@/mock/guests";
import type {
  AttentionNotice,
  DashboardEvent,
  NoticeTone,
} from "@/types/dashboard";

/** Most urgent first; notices of one tone keep their own order. */
const TONE_ORDER: Record<NoticeTone, number> = {
  attention: 0,
  paused: 0,
  deadline: 1,
  deletion: 1,
  billing: 2,
  hidden: 2,
};

/** Where each notice takes the host, by key. One without a page yet has none. */
const NOTICE_HREF: Partial<Record<string, (eventId: string) => string>> = {
  attention: (eventId) => eventPath(eventId, "guests"),
  paused: (eventId) => eventPath(eventId, "details"),
  repliesClosing: (eventId) => eventPath(eventId, "guests"),
  repliesClosed: (eventId) => eventPath(eventId, "guests"),
  hiddenPaid: (eventId) => eventPath(eventId, "details"),
  /* Paying is on the Overview, beside the package. */
  unpaid: (eventId) => eventPath(eventId),
};

/** A notice's page — the same from the card, the rail and the event's to-dos. */
export function noticeHref(notice: AttentionNotice): string | undefined {
  return NOTICE_HREF[notice.key]?.(notice.eventId);
}

function byUrgency(notices: AttentionNotice[]): AttentionNotice[] {
  return [...notices].sort(
    (first, second) => TONE_ORDER[first.tone] - TONE_ORDER[second.tone],
  );
}

/** Every notice, most urgent first: the rail's list. */
export const NOTICES = byUrgency(ATTENTION_NOTICES);

/** One event's notices, in the same order: its card's to-dos. */
function noticesFor(eventId: string): AttentionNotice[] {
  return NOTICES.filter((notice) => notice.eventId === eventId);
}

/**
 * What the event's own state says needs doing — the warnings its pages used
 * to open with: replies to sort out, replies paused, the reply form closing
 * or closed, unpaid, paid but hidden.
 */
function stateNotices(event: DashboardEvent): AttentionNotice[] {
  const base = { eventId: event.id, values: { event: shortTitle(event) } };
  const notices: AttentionNotice[] = [];
  const attention = countRows(
    buildRows(findGuests(event.id), event.preloaded),
  ).attention;
  const replies = replyWindow(event);

  if (attention > 0) {
    notices.push({
      ...base,
      id: `attention-${event.id}`,
      key: "attention",
      values: { ...base.values, count: attention },
      tone: "attention",
    });
  }
  if (repliesPaused(event)) {
    notices.push({
      ...base,
      id: `paused-${event.id}`,
      key: "paused",
      tone: "paused",
      reportHref: floodReportPath(event),
    });
  }
  /* Late replies are worth adding only until the event: once it has passed, no warning. */
  if (
    (replies === "closed" && !isPast(event)) ||
    (replies === "soon" && event.repliesCloseIn)
  ) {
    notices.push({
      ...base,
      id: `replies-close-${event.id}`,
      key: replies === "closed" ? "repliesClosed" : "repliesClosing",
      span: event.repliesCloseIn,
      closesAt: event.repliesCloseAt,
      eventDate: event.date,
      values: {
        ...base.values,
        pending: event.rsvp.pending,
        custom: event.repliesCloseAt ? "yes" : "no",
        change:
          event.repliesCloseAt &&
          countdownNow(event) < defaultReplyClose(event.date)
            ? "yes"
            : "no",
      },
      tone: "deadline",
    });
  }
  if (!event.paid) {
    notices.push({
      ...base,
      id: `unpaid-${event.id}`,
      key: "unpaid",
      package: event.package,
      tone: "billing",
    });
  } else if (event.visibility === "hidden") {
    notices.push({
      ...base,
      id: `hidden-${event.id}`,
      key: "hiddenPaid",
      tone: "hidden",
    });
  }
  return notices;
}

/**
 * One event's to-dos on its Overview: its alerts, plus whatever its own
 * state says needs doing that the alerts don't already hold, most urgent
 * first.
 */
export function eventTodos(event: DashboardEvent): AttentionNotice[] {
  const alerts = noticesFor(event.id);
  const keys = new Set(alerts.map((notice) => notice.key));
  return byUrgency([
    ...alerts,
    ...stateNotices(event).filter((notice) => !keys.has(notice.key)),
  ]);
}

/**
 * The values a notice's texts are filled from — title, body, action and
 * context all read the same ones — written out in the reader's language.
 */
export function useNoticeValues() {
  const locale = useLocale();
  const tPackages = useTranslations("Packages");

  return (notice: AttentionNotice) => ({
    ...notice.values,
    ...(notice.span ? { time: formatDuration(notice.span, locale) } : {}),
    ...(notice.eventDate
      ? {
          date: formatDeadline(
            notice.key.startsWith("replies")
              ? replyClose({
                  date: notice.eventDate,
                  repliesCloseAt: notice.closesAt,
                })
              : deletionDate(notice.eventDate),
            locale,
          ),
        }
      : {}),
    ...(notice.package
      ? {
          package: tPackages(`${notice.package}.name`),
          price: tPackages("price", {
            amount: PACKAGES[notice.package].price,
          }),
        }
      : {}),
  });
}
