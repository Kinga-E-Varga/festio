import { useLocale, useTranslations } from "next-intl";
import {
  deletionDate,
  formatDeadline,
  formatDuration,
  replyClose,
} from "@/lib/event";
import { ATTENTION_NOTICES, PACKAGES } from "@/mock/dashboard";
import type { AttentionNotice, NoticeTone } from "@/types/dashboard";

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
  attention: (eventId) => `/dashboard/events/${eventId}/guests`,
  paused: (eventId) => `/dashboard/events/${eventId}`,
  repliesClosing: (eventId) => `/dashboard/events/${eventId}/guests`,
  repliesClosed: (eventId) => `/dashboard/events/${eventId}/guests`,
  hiddenPaid: (eventId) => `/dashboard/events/${eventId}`,
};

/** A notice's page — the same from the card, the rail and the event's to-dos. */
export function noticeHref(notice: AttentionNotice): string | undefined {
  return NOTICE_HREF[notice.key]?.(notice.eventId);
}

/** Every notice, most urgent first: the rail's list. */
export const NOTICES = [...ATTENTION_NOTICES].sort(
  (first, second) => TONE_ORDER[first.tone] - TONE_ORDER[second.tone],
);

/** One event's notices, in the same order: its card's to-dos. */
export function noticesFor(eventId: string): AttentionNotice[] {
  return NOTICES.filter((notice) => notice.eventId === eventId);
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
