import { z } from "zod";
import { LANGUAGES } from "@/lib/language";

/*
 * Building blocks shared by the cards. Plain Zod only — no Firebase import —
 * so the same schemas check a form in the browser and a write on the server.
 */

/**
 * A moment in time, as Firestore stores it. Checked by shape, not class: the
 * Admin SDK and the browser SDK each have their own `Timestamp`.
 */
export interface Moment {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export const momentSchema = z.custom<Moment>(
  (value) =>
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function",
  "Expected a Firestore timestamp",
);

/** A calendar day, `YYYY-MM-DD`, in the event's own time zone. */
export const dateSchema = z.iso.date();

/** A wall-clock time, `YYYY-MM-DDTHH:MM`, in the event's own time zone. */
export const localDateTimeSchema = z.iso.datetime({ local: true });

/** A permanent ID: answers, seats and matches point to it, so it never changes. */
export const idSchema = z.string().min(1);

/** A count kept on a card; never below zero. */
export const countSchema = z.number().int().nonnegative();

/** Bumped on every save, so a save from another device is noticed. */
export const versionSchema = z.number().int().nonnegative();

export const languageSchema = z.enum(LANGUAGES);

export const packageSchema = z.enum(["free", "standard", "custom"]);

export const rsvpStatusSchema = z.enum(["going", "not_going"]);
