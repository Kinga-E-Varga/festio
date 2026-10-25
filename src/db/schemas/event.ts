import { z } from "zod";
import {
  CANCEL_MESSAGE_MAX,
  EVENT_KINDS,
  PASSWORD_PATTERN,
  TITLE_MAX,
  TITLE_MIN,
} from "@/db/limits";
import { ageGroupSchema, dietNeedSchema } from "@/db/schemas/reply";
import { SLUG_MAX, SLUG_MIN, SLUG_PATTERN } from "@/lib/slug";
import {
  countSchema,
  dateSchema,
  idSchema,
  languageSchema,
  localDateTimeSchema,
  momentSchema,
  packageSchema,
  timeZoneSchema,
  versionSchema,
} from "@/db/schemas/common";

/** `events/{eventId}` — one card per event. */

export const eventKindSchema = z.enum(EVENT_KINDS);

export const visibilitySchema = z.enum(["hidden", "public", "protected"]);

/**
 * A link's shape only. Whether a link can be taken (not reserved) is checked
 * where it changes: a name reserved later never breaks an event that has it.
 */
export const slugSchema = z
  .string()
  .min(SLUG_MIN)
  .max(SLUG_MAX)
  .regex(SLUG_PATTERN);

export const questionScopeSchema = z.enum(["person", "reply"]);

const questionBase = {
  id: idSchema,
  /** The host's own wording, in the invitation's language. */
  label: z.string().trim().min(1),
  scope: questionScopeSchema,
  required: z.boolean(),
  /** Hidden from the form; its answers still show and export. */
  archived: z.boolean(),
};

/** A host's own question. Asked only of people coming. */
export const questionSchema = z.discriminatedUnion("kind", [
  z.object({
    ...questionBase,
    kind: z.literal("choice"),
    options: z
      .array(z.object({ id: idSchema, label: z.string().trim().min(1) }))
      .min(1),
  }),
  z.object({ ...questionBase, kind: z.literal("yesNo") }),
  z.object({ ...questionBase, kind: z.literal("text") }),
]);

export const printShapeSchema = z.enum(["flat", "folded"]);

/** The printable's settings, saved when it is exported. */
export const printSettingsSchema = z.object({
  shape: printShapeSchema,
  /** Whether the faces the host writes are printed on the template's colour or on bare paper. */
  tinted: z.boolean(),
  /**
   * The larger of the two printed lines. It opens on the invitation's RSVP
   * message, which is only where it starts — the two are separate from the
   * first keystroke, and editing one never touches the other.
   */
  headline: z.string(),
  /** The smaller line under it, pointing the guest at the link. */
  note: z.string(),
});

/**
 * Kept up to date in the same transaction as every reply change, so the
 * dashboard never reads every reply. Replied and invited are worked out.
 */
export const eventCountsSchema = z.object({
  /** People coming. */
  coming: countSchema,
  notComing: countSchema,
  /** Names to sort out with the list on: not on it, or used by more than one reply. */
  needsAttention: countSchema,
  /** Names to sort out with the list off: used by more than one reply. */
  needsAttentionNoList: countSchema,
  /** Pre-loaded names no reply claims, with the list on; nothing waits with it off. */
  waiting: countSchema,
  seatingWarnings: countSchema,
});

/**
 * What the Overview's Replies box shows of the people coming: how many in
 * each age group and with each diet, and how many answered the host's own
 * questions. Kept beside `counts`, each reply card adding on its own.
 */
export const replySummarySchema = z.object({
  ages: z.record(ageGroupSchema, countSchema),
  diets: z.record(dietNeedSchema, countSchema),
  answeredCustom: countSchema,
});

/** The card's fields, without its cross-field rules: other schemas pick from it. */
export const eventFieldsSchema = z.object({
  /** The host's Auth user ID. */
  hostId: idSchema,
  /** The host's side only; never copied into the invitation. */
  title: z.string().trim().min(TITLE_MIN).max(TITLE_MAX),
  kind: eventKindSchema,
  /** The invitation's own language, never the host's app locale. */
  language: languageSchema,
  date: dateSchema,
  /** From the host's browser, e.g. `Europe/Bucharest`; every time rule uses it. */
  timeZone: timeZoneSchema,
  /** The host's own closing time. Missing = the day before the event at 00:00. */
  repliesCloseAt: localDateTimeSchema.optional(),
  slug: slugSchema,
  visibility: visibilitySchema,
  /** Stored as typed: the host sees it and it's printed on the card. Only the server reads it. */
  password: z.string().regex(PASSWORD_PATTERN).optional(),
  expectedGuests: z.number().int().positive(),
  /** A guest list is pre-loaded. */
  preloaded: z.boolean(),
  /** What has been bought. Paid for = the template's package is no higher. */
  package: packageSchema,
  /** Missing until the host picks a template. */
  templateId: z.string().min(1).optional(),
  questions: z.array(questionSchema),
  print: printSettingsSchema.optional(),
  counts: eventCountsSchema,
  summary: replySummarySchema,
  /** Missing = not cancelled. */
  cancelled: z
    .object({
      message: z.string().trim().max(CANCEL_MESSAGE_MAX),
      at: momentSchema,
    })
    .optional(),
  /** Past the retention window: only a leftover of this card remains. */
  dataDeleted: z.boolean(),
  version: versionSchema,
  /**
   * Goes up by one with every save that writes or deletes a reply card or
   * changes the list's names (spelling or who is on it), in the same
   * transaction. Not with a `sent` mark, the list switch or a recount.
   */
  dataVersion: versionSchema,
  /**
   * The invitation card's version, set by its save in the same transaction
   * (0 before the first). Read-only views cache the invitation under it.
   */
  invitationVersion: versionSchema,
  createdAt: momentSchema,
});

/** A Protected invitation needs a password; the card and the settings save both check it. */
const needsPassword = (event: { visibility: string; password?: string }) =>
  event.visibility !== "protected" || Boolean(event.password);
const NEEDS_PASSWORD = {
  message: "A Protected invitation needs a password",
  path: ["password"],
};

export const eventSchema = eventFieldsSchema.refine(
  needsPassword,
  NEEDS_PASSWORD,
);

/**
 * What Event settings sends: the fields its form edits, and the card's
 * version it started from. The package, template, questions, counters,
 * cancel and print settings are never in it, so only the server changes them.
 */
export const eventSettingsSchema = eventFieldsSchema
  .pick({
    title: true,
    kind: true,
    language: true,
    date: true,
    repliesCloseAt: true,
    slug: true,
    visibility: true,
    password: true,
    expectedGuests: true,
    preloaded: true,
  })
  .extend({ version: versionSchema })
  .refine(needsPassword, NEEDS_PASSWORD);

export type EventDoc = z.infer<typeof eventSchema>;
export type EventSettings = z.infer<typeof eventSettingsSchema>;
export type Question = z.infer<typeof questionSchema>;
