import { useLocale } from "next-intl";
import {
  countdownNow,
  defaultReplyClose,
  deletionDate,
  eventStatus,
  eventPath,
  floodReportPath,
  formatDeadline,
  formatDuration,
  isArchived,
  isPast,
  replyClose,
  replyWindow,
  repliesPaused,
  shortTitle,
} from "@/lib/event";
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
  hidden: 2,
};

/** Where each notice takes the host, by key. One without a page yet has none. */
const NOTICE_HREF: Partial<Record<string, (eventId: string) => string>> = {
  attention: (eventId) => eventPath(eventId, "guests"),
  paused: (eventId) => eventPath(eventId, "details"),
  repliesClosing: (eventId) => eventPath(eventId, "guests"),
  repliesClosed: (eventId) => eventPath(eventId, "guests"),
  hidden: (eventId) => eventPath(eventId, "details"),
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

/** The reply form closing soon or closed, with who is left to chase. */
function closingNotice(
  event: DashboardEvent,
  pending: number,
): AttentionNotice {
  return {
    id: `replies-close-${event.id}`,
    eventId: event.id,
    key: replyWindow(event) === "closed" ? "repliesClosed" : "repliesClosing",
    span: event.repliesCloseIn,
    closesAt: event.repliesCloseAt,
    eventDate: event.date,
    values: {
      event: shortTitle(event),
      /* Who is left to chase: the task names them. */
      pending,
      custom: event.repliesCloseAt ? "yes" : "no",
      /*
       * A custom time can still move until the default close. On the default
       * time there is nothing to change, so the guest list is offered instead.
       */
      change:
        event.repliesCloseAt &&
        countdownNow(event) < defaultReplyClose(event.date)
          ? "yes"
          : "no",
    },
    tone: "deadline",
  };
}

/**
 * The rail warns of a closing form for an active event still ahead; a closed
 * form is worth a warning only until the event has passed.
 */
function closingOnRail(event: DashboardEvent): boolean {
  return (
    eventStatus(event) === "active" &&
    replyWindow(event) !== "open" &&
    !isPast(event)
  );
}

/** The events whose closing notice names who is left to chase: they need their guest list read. */
export function needsWaiting(event: DashboardEvent): boolean {
  return event.preloaded && closingOnRail(event);
}

/**
 * One event's notices. On the rail (`overview` false) only what still needs
 * the host now: active events for replies, nothing about a past one but its
 * deletion. Its Overview also lists what its own state says needs doing,
 * Hidden or not. `waiting` is who on its list hasn't replied yet.
 */
function eventNotices(
  event: DashboardEvent,
  waiting: number,
  overview: boolean,
): AttentionNotice[] {
  const base = { eventId: event.id, values: { event: shortTitle(event) } };
  const active = overview || eventStatus(event) === "active";
  const past = isPast(event);
  const replies = replyWindow(event);
  const notices: AttentionNotice[] = [];
  if (active && event.needsAttention > 0) {
    notices.push({
      ...base,
      id: `attention-${event.id}`,
      key: "attention",
      values: { ...base.values, count: event.needsAttention },
      tone: "attention",
    });
  }
  /* Only active events can still take replies. */
  if (active && repliesPaused(event)) {
    notices.push({
      ...base,
      id: `paused-${event.id}`,
      key: "paused",
      tone: "paused",
      reportHref: floodReportPath(event),
    });
  }
  const closing = overview
    ? (replies === "closed" && !past) || replies === "soon"
    : closingOnRail(event);
  if (closing) notices.push(closingNotice(event, waiting));
  /* Set to Hidden: nobody can open it yet. */
  if (event.visibility === "hidden" && (overview || !past)) {
    notices.push({
      ...base,
      id: `hidden-${event.id}`,
      key: "hidden",
      tone: "hidden",
    });
  }
  /* Over, with its data not yet deleted: the last chance to export it. */
  if (past && !event.dataDeleted) {
    notices.push({
      ...base,
      id: `deleting-${event.id}`,
      key: "deleting",
      eventDate: event.date,
      tone: "deletion",
    });
  }
  return notices;
}

/**
 * Every event's alerts, most urgent first: the rail's list. Each notice's
 * title and body are the event editor's banner for the same thing
 * (`EventPage.<key>Title` / `<key>Body`), so the two always read alike;
 * `Notices.<key>` holds only the rail's own context and action. `waiting`
 * is who hasn't replied yet, by event, for the events `needsWaiting` names.
 */
export function hostNotices(
  events: DashboardEvent[],
  waiting: Record<string, number>,
): AttentionNotice[] {
  /* An archived event has nothing left to act on. */
  return byUrgency(
    events
      .filter((event) => !isArchived(event))
      .flatMap((event) => eventNotices(event, waiting[event.id] ?? 0, false)),
  );
}

/** One event's to-dos on its Overview, most urgent first. */
export function eventTodos(
  event: DashboardEvent,
  waiting: number,
): AttentionNotice[] {
  return byUrgency(eventNotices(event, waiting, true));
}

/**
 * The values a notice's texts are filled from — title, body, action and
 * context all read the same ones — written out in the reader's language.
 */
export function useNoticeValues() {
  const locale = useLocale();

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
  });
}
