import { formatDay, isRealDate } from "@/lib/event";
import { LANGUAGE_LOCALE, type Language } from "@/lib/language";
import type { Group, ListItem, SectionValues } from "@/types/modular";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** `HH:MM`, 24-hour — what a `time` field holds. */
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/** One plain value; empty when the field is missing or is a list. */
export function text(values: SectionValues, id: string): string {
  const value = values[id];
  return typeof value === "string" ? value : "";
}

/** One `toggle` field: on unless it is set off. */
export function isOn(values: SectionValues, id: string): boolean {
  return values[id] !== false;
}

function isGroup(item: ListItem | Group): item is Group {
  return typeof item.values === "object";
}

/** One list's items; empty when the field is missing or is not a list. */
export function list(values: SectionValues, id: string): ListItem[] {
  const value = values[id];
  if (!Array.isArray(value)) return [];
  return (value as (ListItem | Group)[]).filter(
    (item): item is ListItem => !isGroup(item),
  );
}

/** One `groups` field's groups; empty when the field is missing or is not one. */
export function groups(values: SectionValues, id: string): Group[] {
  const value = values[id];
  if (!Array.isArray(value)) return [];
  return (value as (ListItem | Group)[]).filter(isGroup);
}

function day(iso: string): Date {
  return new Date(`${iso}T00:00`);
}

/** "Saturday", in the invitation's language. */
export function weekday(iso: string, language: Language): string {
  return day(iso).toLocaleDateString(LANGUAGE_LOCALE[language], {
    weekday: "long",
  });
}

/** "September", in the invitation's language. */
export function monthName(iso: string, language: Language): string {
  return day(iso).toLocaleDateString(LANGUAGE_LOCALE[language], {
    month: "long",
  });
}

/** 18 — the day of the month. */
export function dayOfMonth(iso: string): number {
  return day(iso).getDate();
}

/** 2027. */
export function yearOf(iso: string): number {
  return day(iso).getFullYear();
}

/**
 * A schedule day's date, always written the same way: EN "Friday · 17 Sept",
 * RO "Vineri · 17 sept.", HU "Péntek · szept. 17.". Empty when it is not a
 * real day.
 */
export function scheduleDay(iso: string, language: Language): string {
  const date = day(iso);
  if (!isRealDate(date)) return "";
  const locale = LANGUAGE_LOCALE[language];
  const name = date.toLocaleDateString(locale, { weekday: "long" });
  const short = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
  });
  return `${name.charAt(0).toLocaleUpperCase(locale)}${name.slice(1)} · ${short}`;
}

/** "18 September 2027", in the invitation's language. */
export function longDate(iso: string, language: Language): string {
  return formatDay(iso, language);
}

/** When the event's day begins, in the guest's own clock: its midnight. */
export function eventStart(iso: string): Date {
  return day(iso);
}

/**
 * A `time` value as the invitation writes it: EN "3:30 pm", RO and HU
 * "15:30". Anything that is not `HH:MM` is shown as typed.
 */
export function formatTime(time: string, language: Language): string {
  if (!TIME.test(time) || language !== "en") return time;
  const [hours, minutes] = time.split(":");
  const hour = Number(hours);
  return `${hour % 12 || 12}:${minutes} ${hour < 12 ? "am" : "pm"}`;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** What is left until `target`, never below zero. */
export function timeLeft(target: Date, now: number): TimeLeft {
  const left = Math.max(0, target.getTime() - now);
  return {
    days: Math.floor(left / DAY_MS),
    hours: Math.floor(left / HOUR_MS) % 24,
    minutes: Math.floor(left / MINUTE_MS) % 60,
    seconds: Math.floor(left / SECOND_MS) % 60,
  };
}

/**
 * A photo's path, only when `next/image` can draw it: a path on this site.
 * Uploads (Firebase Storage) will need `images.remotePatterns` first.
 */
export function imageSrc(value: string): string | null {
  /* `//` and `/\` are both read by browsers as another host. */
  return value.startsWith("/") && !/^\/[/\\]/.test(value) ? value : null;
}

/**
 * A web address a host typed, only when it is one: anything but http(s) is
 * dropped, so a link on the invitation can never run script.
 */
export function safeLink(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** What "Open in Maps" searches for: the venue, then its address on one line. */
export function mapsQuery(venue = "", address = ""): string {
  return [venue, address.replace(/\n/g, ", ")].filter(Boolean).join(", ");
}
