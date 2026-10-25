import { z } from "zod";
import { idSchema, momentSchema, rsvpStatusSchema } from "@/db/schemas/common";
import { RSVP_NAME_MAX, RSVP_NOTE_MAX, RSVP_PEOPLE_MAX } from "@/db/limits";

/**
 * `events/{eventId}/replies/{replyId}` — one card per form a guest (or the
 * host) sends, with everyone it answers for inside.
 *
 * Answers: missing = never asked, null = asked and skipped. The Unknown and
 * Duplicate tags are never stored; they're worked out live.
 */

export const ageGroupSchema = z.enum(["adult", "child", "baby"]);

export const dietNeedSchema = z.enum([
  "vegetarian",
  "vegan",
  "glutenFree",
  "lactoseFree",
  "nutAllergy",
  "other",
]);

export const accessNeedSchema = z.enum([
  "stepFree",
  "walking",
  "hearing",
  "sight",
  "other",
]);

/**
 * A needs question's answer (diet, accessibility): the option ids picked
 * (empty = none) and what was written for `other`. Each question's own
 * options decide which ids fit, see `answerFor`.
 */
export const needsAnswerSchema = z.object({
  needs: z.array(z.string()),
  other: z.string().optional(),
});

/** A choice's option ID, a yes/no, free text, or a needs answer. */
export const answerSchema = z
  .union([z.string(), z.boolean(), needsAnswerSchema])
  .nullable();

export type NeedsAnswer = z.infer<typeof needsAnswerSchema>;
export type Answer = z.infer<typeof answerSchema>;

/** Answers by question ID. */
const answersSchema = z.record(z.string(), answerSchema);

export const personSchema = z.object({
  /** Permanent: seating points to it, and it survives Separate from group. */
  id: idSchema,
  name: z.string().trim().min(1),
  /** Answers to the per-person questions, age and diet included. */
  answers: answersSchema.optional(),
  /** The pre-loaded name the host matched this person to. */
  listNameId: idSchema.optional(),
  /** The host said a same-name reply isn't the same guest. */
  differentPerson: z.boolean().optional(),
});

export const replySchema = z.object({
  sentAt: momentSchema,
  /** One answer for everyone in the reply. */
  status: rsvpStatusSchema,
  /** The message to the host; null = skipped. */
  message: z.string().nullable(),
  /** Answers to the questions asked once per reply. */
  answers: answersSchema.optional(),
  /** Lets "new replies" count only guests'. */
  createdBy: z.enum(["guest", "host"]),
  /** When the host last changed it; missing if never. */
  editedAt: momentSchema.optional(),
  people: z.array(personSchema).min(1),
});

/**
 * What a guest's browser sends: the reply's answers and its ID, never the
 * people's IDs, times or who sent it — the server sets those. The answers
 * are kept only for a reply that is coming, once checked against the
 * event's questions.
 */
export const guestReplySchema = z.object({
  /** Made once by the form, so a reply sent twice is saved once. */
  id: z.uuid(),
  status: rsvpStatusSchema,
  message: z.string().trim().max(RSVP_NOTE_MAX).nullable(),
  /** Answers to the questions asked once per reply. */
  answers: answersSchema.optional(),
  people: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(RSVP_NAME_MAX),
        /** Answers to the questions asked of each person. */
        answers: answersSchema.optional(),
      }),
    )
    .min(1)
    .max(RSVP_PEOPLE_MAX),
});

export type ReplyDoc = z.infer<typeof replySchema>;
export type GuestReplyInput = z.infer<typeof guestReplySchema>;
export type GuestPersonInput = GuestReplyInput["people"][number];
export type Person = z.infer<typeof personSchema>;
