import { formatDay } from "@/lib/event";
import {
  LANGUAGE_LOCALE,
  localized,
  type Language,
  type LocalizedText,
} from "@/lib/language";
import type {
  Group,
  InvitationBasics,
  ListItem,
  SectionDefinition,
  SectionField,
  SectionValues,
} from "@/types/modular";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/** `HH:MM`, 24-hour — what a `time` field holds. */
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

function localizeItem(
  item: Record<string, LocalizedText>,
  language: Language,
): ListItem {
  return Object.fromEntries(
    Object.entries(item).map(([id, copy]) => [id, localized(copy, language)]),
  );
}

function fallbackValue(
  field: SectionField,
  language: Language,
): SectionValues[string] {
  switch (field.type) {
    case "toggle":
      return field.fallback;
    case "list":
      return field.fallback.map((item) => localizeItem(item, language));
    case "groups":
      return field.fallback.map((group) => ({
        values: localizeItem(group.values, language),
        items: group.items.map((item) => localizeItem(item, language)),
      }));
    default:
      return localized(field.fallback, language);
  }
}

/**
 * A section's sample content in one language. There is no event yet, so
 * every field is its own fallback; later the host's values lie over it.
 */
export function sectionValues(
  definition: SectionDefinition,
  language: Language,
): SectionValues {
  return Object.fromEntries(
    definition.fields.map((field) => [
      field.id,
      fallbackValue(field, language),
    ]),
  );
}

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

/** "Mara & Luca" — or just "Mara" for one host. */
export function hostNames(basics: InvitationBasics): string {
  return filledHosts(basics).join(" & ");
}

/** "M & L" — the mark when the host wrote none. */
export function hostInitials(basics: InvitationBasics): string {
  return filledHosts(basics)
    .map((name) => name.charAt(0).toUpperCase())
    .join(" & ");
}

/** The hosts' names, trimmed, without the empty ones — so no stray "&". */
function filledHosts(basics: InvitationBasics): string[] {
  return basics.hosts.map((name) => name.trim()).filter(Boolean);
}

/** The top bar's mark from its values: the host's own, else their initials. */
export function markOf(
  values: SectionValues,
  basics: InvitationBasics,
): string {
  return text(values, "mark") || hostInitials(basics);
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

/** "18 September 2027", in the invitation's language. */
export function longDate(iso: string, language: Language): string {
  return formatDay(iso, language);
}

/**
 * When the event starts, in the guest's own clock: the day at `time` when it
 * is a real `HH:MM`, else at midnight.
 */
export function eventStart(iso: string, time?: string): Date {
  return new Date(`${iso}T${time && TIME.test(time) ? time : "00:00"}`);
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
