import type { CSSProperties } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { DashboardEvent, EventStatus } from "@/types/dashboard";

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
export function invitationPath(event: {
  slug: string;
  digits: string;
}): string {
  return `/${event.slug}-${event.digits}`;
}

/** The guest-facing address: the host's slug plus Festio's four random digits. */
export function invitationLink(event: { slug: string; digits: string }): string {
  return `festio.eu${invitationPath(event)}`;
}

/** Slugs carry lowercase letters, digits and single hyphens, nothing else. */
export function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Yes and no stack against the same cap, so the bar shows how much of the
 * safeguard is already spoken for and how much is still open.
 */
export function safeguardBarVars(event: {
  rsvp: { attending: number; declined: number };
  safeguard: { cap: number };
}): CSSProperties {
  const { cap } = event.safeguard;
  const attending =
    cap > 0 ? Math.min(100, (event.rsvp.attending / cap) * 100) : 0;
  const declined =
    cap > 0 ? Math.min(100 - attending, (event.rsvp.declined / cap) * 100) : 0;

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

export function isRealDate(value: Date): boolean {
  return !Number.isNaN(value.getTime());
}

/** "6 September 2026" */
export function formatEventDate(value: Date): string {
  return value.toLocaleDateString("en-GB", DATE_PARTS);
}

/** "5 September 2026, 00:00" — the long form, behind `formatDeadline`. */
function formatStamp(value: Date): string {
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${formatEventDate(value)}, ${hours}:${minutes}`;
}

/**
 * A deadline as a host would say it out loud: the date on its own when it
 * falls at midnight, and the date plus the time when the hour carries meaning.
 * Midnight is the shape a date with no time of day takes once it is parsed, so
 * stating "00:00" back would only ever be noise.
 */
export function formatDeadline(value: Date): string {
  const midnight = value.getHours() === 0 && value.getMinutes() === 0;
  return midnight ? formatEventDate(value) : formatStamp(value);
}

/** The `YYYY-MM-DDTHH:MM` shape a `datetime-local` input expects. */
export function toDateTimeLocal(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}
