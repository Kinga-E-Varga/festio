import type { CSSProperties } from "react";
import {
  EXPECTED_WARNING_PERCENT,
  GUEST_DATA_RETENTION_DAYS,
  REPLIES_CLOSING_SOON_DAYS,
  REPLY_CAP_MARGIN,
  REPLY_CAP_MIN_EXTRA,
} from "@/lib/config";
import { LANGUAGE_LOCALE, type Language } from "@/lib/language";
import type {
  DashboardEvent,
  EventStatus,
  TimeSpan,
} from "@/types/dashboard";

/**
 * A pile of events still ahead reads soonest first — the next one is the one
 * that needs work. A past pile reads the other way round: the event that has
 * just happened is the one still being tidied up, so it leads.
 *
 * Dates are ISO `YYYY-MM-DD`, which sorts correctly as plain text.
 */
export function orderEvents(
  events: DashboardEvent[],
  status: EventStatus,
): DashboardEvent[] {
  const direction = status === "past" ? -1 : 1;
  return [...events].sort(
    (first, second) => direction * first.date.localeCompare(second.date),
  );
}

/** The guest-facing address as a route this app can navigate to. */
export function invitationPath(event: { slug: string }): string {
  return `/${event.slug}`;
}

/** The guest-facing address: the host's slug, nothing added. */
export function invitationLink(event: { slug: string }): string {
  return `festio.eu${invitationPath(event)}`;
}

interface ReplyCounts {
  rsvp: { replied: number; attending: number; declined: number };
  expectedGuests: number;
}

/**
 * The hidden reply cap. Hosts only ever see their expected guests; the form
 * pauses at this number, which sits well above it.
 */
export function replyCap(expectedGuests: number): number {
  const extra = Math.max(
    Math.ceil(expectedGuests * REPLY_CAP_MARGIN),
    REPLY_CAP_MIN_EXTRA,
  );
  return expectedGuests + extra;
}

/** True once replies reach the hidden cap and the form stops taking more. */
export function repliesPaused(event: ReplyCounts): boolean {
  return event.rsvp.replied >= replyCap(event.expectedGuests);
}

/** From 100% of expected guests, a host can report the replies as a flood. */
export function canReportFlood(event: ReplyCounts): boolean {
  return event.rsvp.replied > 0 && event.rsvp.replied >= event.expectedGuests;
}

export function floodReportPath(event: { id: string }): string {
  return `/dashboard/events/${event.id}/report`;
}

/** Replies received as a share of expected guests. May pass 100. */
export function expectedPercent(replied: number, expectedGuests: number): number {
  return expectedGuests > 0 ? Math.round((replied / expectedGuests) * 100) : 100;
}

export type ExpectedLevel = "ok" | "warn" | "over";

/** How the replies bars are coloured: normal, nearing expected, at or past it. */
export function expectedLevel(percent: number): ExpectedLevel {
  if (percent >= 100) return "over";
  if (percent >= EXPECTED_WARNING_PERCENT) return "warn";
  return "ok";
}

/**
 * Yes and no stack against expected guests. Past expected, the bar is full
 * and the two keep their share of the replies.
 */
export function repliesBarVars(event: ReplyCounts): CSSProperties {
  const scale = Math.max(event.expectedGuests, event.rsvp.replied);
  const attending = scale > 0 ? (event.rsvp.attending / scale) * 100 : 0;
  const declined = scale > 0 ? (event.rsvp.declined / scale) * 100 : 0;

  return {
    "--attending": `${attending}%`,
    "--declined": `${declined}%`,
  } as CSSProperties;
}

const DAY_MS = 86_400_000;

const DATE_PARTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

/**
 * Editing and the reply form both stop at midnight on the day before the
 * event — the project's 24h freeze, expressed as a wall-clock cut-off.
 */
export function contentFreeze(date: string): Date {
  return new Date(new Date(`${date}T00:00`).getTime() - DAY_MS);
}

/** When the whole record goes, per the configurable retention window. */
export function deletionDate(date: string): Date {
  return new Date(
    new Date(`${date}T00:00`).getTime() + GUEST_DATA_RETENTION_DAYS * DAY_MS,
  );
}

/** When the reply form closes: the host's own time, else the day before. */
export function replyClose(event: {
  date: string;
  repliesCloseAt?: string;
}): Date {
  return event.repliesCloseAt
    ? new Date(event.repliesCloseAt)
    : contentFreeze(event.date);
}

export type ReplyWindow = "open" | "soon" | "closed";

const SPAN_MS: Record<TimeSpan["unit"], number> = {
  minute: 60_000,
  hour: 3_600_000,
  day: DAY_MS,
  week: 7 * DAY_MS,
};

/** Open, closing within the warning window, or already closed. */
export function replyWindow(event: {
  status: EventStatus;
  repliesCloseIn?: TimeSpan;
}): ReplyWindow {
  if (event.status === "past") return "closed";
  const span = event.repliesCloseIn;
  if (!span) return "open";
  const ms = span.value * SPAN_MS[span.unit];
  if (ms <= 0) return "closed";
  return ms <= REPLIES_CLOSING_SOON_DAYS * DAY_MS ? "soon" : "open";
}

export function isRealDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

/** "6 September 2026", in the language it is read in. */
export function formatEventDate(value: Date, language: Language): string {
  return value.toLocaleDateString(LANGUAGE_LOCALE[language], DATE_PARTS);
}

/** An ISO `YYYY-MM-DD` day as `formatEventDate` writes it. */
export function formatDay(date: string, language: Language): string {
  return formatEventDate(new Date(`${date}T00:00`), language);
}

/** "in 2 days", "12 weeks ago", "yesterday" — counted from now. */
export function formatRelative(span: TimeSpan, language: Language): string {
  return new Intl.RelativeTimeFormat(LANGUAGE_LOCALE[language], {
    numeric: "auto",
  }).format(span.value, span.unit);
}

/** "30 hours" — a length of time on its own, for a sentence to place. */
export function formatDuration(span: TimeSpan, language: Language): string {
  return new Intl.NumberFormat(LANGUAGE_LOCALE[language], {
    style: "unit",
    unit: span.unit,
    unitDisplay: "long",
  }).format(span.value);
}

/** "5 September 2026, 00:00" — the long form, behind `formatDeadline`. */
function formatStamp(value: Date, language: Language): string {
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${formatEventDate(value, language)}, ${hours}:${minutes}`;
}

/**
 * A deadline as a host would say it out loud: the date on its own when it
 * falls at midnight, and the date plus the time when the hour carries meaning.
 * Midnight is the shape a date with no time of day takes once it is parsed, so
 * stating "00:00" back would only ever be noise.
 */
export function formatDeadline(value: Date, language: Language): string {
  const midnight = value.getHours() === 0 && value.getMinutes() === 0;
  return midnight
    ? formatEventDate(value, language)
    : formatStamp(value, language);
}

/** The `YYYY-MM-DDTHH:MM` shape a `datetime-local` input expects. */
export function toDateTimeLocal(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}
