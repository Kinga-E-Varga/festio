import type { CSSProperties } from "react";
import {
  GUEST_DATA_RETENTION_DAYS,
  REPLIES_CLOSING_SOON_DAYS,
  REPLY_CAP_MARGIN,
  REPLY_CAP_MIN_EXTRA,
} from "@/lib/config";
import { LANGUAGE_LOCALE, type Language } from "@/lib/language";
import type {
  DashboardEvent,
  EventStatus,
  HomeEventRow,
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

/**
 * Home's events as its box lists them: the upcoming soonest first, then
 * the past latest first, each with its status worked out.
 */
export function homeRows(events: DashboardEvent[]): HomeEventRow[] {
  const past = events.filter(isPast);
  const upcoming = events.filter((event) => !isPast(event));
  return [...orderEvents(upcoming, "active"), ...orderEvents(past, "past")].map(
    (event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      countdown: event.countdown,
      rsvp: event.rsvp,
      expectedGuests: event.expectedGuests,
      status: eventStatus(event),
      archived: isArchived(event),
    }),
  );
}

/**
 * True once the event has happened. Read from the event's own countdown, so
 * it always agrees with the "2 weeks ago" the cards show.
 */
export function isPast(event: { countdown: TimeSpan }): boolean {
  return event.countdown.value < 0;
}

/** Past and its guest data deleted: the record is a stub, with nothing to open. */
export function isArchived(event: {
  countdown: TimeSpan;
  dataDeleted: boolean;
}): boolean {
  return isPast(event) && event.dataDeleted;
}

/**
 * Which pile an event is in. Active means guests can open the invitation:
 * paid for and not Hidden. Anything else still ahead is a draft.
 */
export function eventStatus(
  event: Pick<DashboardEvent, "countdown" | "paid" | "visibility">,
): EventStatus {
  if (isPast(event)) return "past";
  return event.paid && event.visibility !== "hidden" ? "active" : "draft";
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

/** One event's page in the dashboard: its Overview, or one of the pages under it. */
export function eventPath(id: string, page?: "details" | "guests"): string {
  const overview = `/dashboard/events/${id}`;
  return page ? `${overview}/${page}` : overview;
}

export function floodReportPath(event: { id: string }): string {
  return `${eventPath(event.id)}/report`;
}

/** Replies received as a share of expected guests. May pass 100. */
export function expectedPercent(
  replied: number,
  expectedGuests: number,
): number {
  return expectedGuests > 0
    ? Math.round((replied / expectedGuests) * 100)
    : 100;
}

export type ExpectedLevel = "ok" | "over";

/** How the replies bars are coloured: normal, or at or past expected. */
export function expectedLevel(percent: number): ExpectedLevel {
  return percent >= 100 ? "over" : "ok";
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

export const DAY_MS = 86_400_000;

/**
 * The same wall-clock time, `days` calendar days on. Not `days × DAY_MS`: a day
 * with a clock change is 23 or 25 hours long.
 */
export function addDays(value: Date, days: number): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate() + days,
    value.getHours(),
    value.getMinutes(),
  );
}

/** A clock or calendar number at two digits: 9 → "09". */
export function pad(part: number): string {
  return String(part).padStart(2, "0");
}

/** "6 September 2026": the long date every card and host screen starts from. */
export const DATE_PARTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
};

/** "5 Sept 2026": the same date with its month cut short, where room is tight. */
export const SHORT_DATE_PARTS: Intl.DateTimeFormatOptions = {
  ...DATE_PARTS,
  month: "short",
};

/** "5 Sept": the day and short month alone, for the event picker. */
export const PICKER_DATE_PARTS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
};

/**
 * The reply form's default close: midnight on the day before the event —
 * the project's 24h rule, expressed as a wall-clock cut-off.
 */
export function defaultReplyClose(date: string): Date {
  return addDays(new Date(`${date}T00:00`), -1);
}

/**
 * True from the start of the event day on: the date can no longer move.
 * Everything else about the event and its invitation stays editable.
 */
export function dateLocked(event: {
  date: string;
  countdown: TimeSpan;
}): boolean {
  return countdownNow(event) >= new Date(`${event.date}T00:00`);
}

/** When the whole record goes, per the configurable retention window. */
export function deletionDate(date: string): Date {
  return addDays(new Date(`${date}T00:00`), GUEST_DATA_RETENTION_DAYS);
}

/** When the reply form closes: the host's own time, else the day before. */
export function replyClose(event: {
  date: string;
  repliesCloseAt?: string;
}): Date {
  return event.repliesCloseAt
    ? new Date(event.repliesCloseAt)
    : defaultReplyClose(event.date);
}

/**
 * The moment an event's countdown is counted from — "now", the way its cards
 * say "in 2 days".
 */
export function countdownNow(event: {
  date: string;
  countdown: TimeSpan;
}): Date {
  const { value, unit } = event.countdown;
  const midnight = new Date(`${event.date}T00:00`);
  if (unit === "day") return addDays(midnight, -value);
  if (unit === "week") return addDays(midnight, -7 * value);
  return new Date(midnight.getTime() - value * SPAN_MS[unit]);
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
  countdown: TimeSpan;
  repliesCloseIn?: TimeSpan;
}): ReplyWindow {
  if (isPast(event)) return "closed";
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
export function formatEventDate(
  value: Date,
  language: Language,
  parts: Intl.DateTimeFormatOptions = DATE_PARTS,
): string {
  return value.toLocaleDateString(LANGUAGE_LOCALE[language], parts);
}

/** An ISO `YYYY-MM-DD` day as `formatEventDate` writes it. */
export function formatDay(
  date: string,
  language: Language,
  parts?: Intl.DateTimeFormatOptions,
): string {
  return formatEventDate(new Date(`${date}T00:00`), language, parts);
}

/** "in 2 days", "12 weeks ago", "today" — counted from now, in numbers but for today. */
export function formatRelative(span: TimeSpan, language: Language): string {
  return new Intl.RelativeTimeFormat(LANGUAGE_LOCALE[language], {
    numeric: span.value === 0 ? "auto" : "always",
  }).format(span.value, span.unit);
}

/** How far `to` is from `from`, in days up to two weeks, in weeks after: for `formatRelative`. */
export function spanBetween(from: Date, to: Date): TimeSpan {
  const days = Math.round((to.getTime() - from.getTime()) / DAY_MS);
  return Math.abs(days) < 14
    ? { value: days, unit: "day" }
    : { value: Math.round(days / 7), unit: "week" };
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
function formatStamp(
  value: Date,
  language: Language,
  parts: Intl.DateTimeFormatOptions,
): string {
  return `${formatEventDate(value, language, parts)}, ${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

/**
 * A deadline as a host would say it out loud: the date on its own when it
 * falls at midnight, and the date plus the time when the hour carries meaning.
 * Midnight is the shape a date with no time of day takes once it is parsed, so
 * stating "00:00" back would only ever be noise.
 */
export function formatDeadline(
  value: Date,
  language: Language,
  parts: Intl.DateTimeFormatOptions = DATE_PARTS,
): string {
  const midnight = value.getHours() === 0 && value.getMinutes() === 0;
  return midnight
    ? formatEventDate(value, language, parts)
    : formatStamp(value, language, parts);
}

/** The `YYYY-MM-DDTHH:MM` shape a `datetime-local` input expects. */
export function toDateTimeLocal(value: Date): string {
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}

/** Today's calendar day, `YYYY-MM-DD`, on the event's own clock. */
export function todayIn(timeZone: string, now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone });
}

/**
 * How far `to` is from `now`, in the unit a person would say it in: minutes
 * within the hour, hours within two days, days within two weeks, then weeks.
 * Negative is in the past.
 */
export function spanFrom(now: Date, to: Date): TimeSpan {
  const ms = to.getTime() - now.getTime();
  const size = Math.abs(ms);
  const unit: TimeSpan["unit"] =
    size < SPAN_MS.hour
      ? "minute"
      : size < 2 * DAY_MS
        ? "hour"
        : size < 14 * DAY_MS
          ? "day"
          : "week";
  return { value: Math.round(ms / SPAN_MS[unit]), unit };
}

/* The part of a title before " — ", which is how the notices and the latest replies name an event. */
export function shortTitle(event: { title: string }): string {
  return event.title.split(" — ")[0];
}
