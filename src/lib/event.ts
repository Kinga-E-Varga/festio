import type { CSSProperties } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";

/** The guest-facing address: the host's slug plus Festio's four random digits. */
export function invitationLink(event: { slug: string; digits: string }): string {
  return `festio.eu/${event.slug}-${event.digits}`;
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

/** "5 September 2026, 00:00" — used wherever the time of day matters. */
export function formatStamp(value: Date): string {
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${formatEventDate(value)}, ${hours}:${minutes}`;
}

/** The `YYYY-MM-DDTHH:MM` shape a `datetime-local` input expects. */
export function toDateTimeLocal(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");
  return (
    `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}` +
    `T${pad(value.getHours())}:${pad(value.getMinutes())}`
  );
}
