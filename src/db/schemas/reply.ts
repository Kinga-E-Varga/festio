import { z } from "zod";
import { idSchema, momentSchema, rsvpStatusSchema } from "@/db/schemas/common";
import {
  RSVP_ANSWER_MAX,
  RSVP_NAME_MAX,
  RSVP_NOTE_MAX,
  RSVP_PEOPLE_MAX,
} from "@/db/limits";

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

/** A choice's option ID, a yes/no, or free text. */
export const answerSchema = z.union([z.string(), z.boolean()]).nullable();

/** Answers by question ID. */
const answersSchema = z.record(z.string(), answerSchema);

export const personSchema = z.object({
  /** Permanent: seating points to it, and it survives Separate from group. */
  id: idSchema,
  name: z.string().trim().min(1),
  /* Asked only when coming; missing when not coming. */
  ageGroup: ageGroupSchema.nullable().optional(),
  /** Empty = no needs. */
  diet: z.array(dietNeedSchema).nullable().optional(),
  /** What the guest wrote for `other`. */
  dietOther: z.string().optional(),
  /** Answers to the host's per-person questions. */
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
 * people's IDs, times or who sent it — the server sets those. Age, diet and
 * the answers to the host's questions are kept only for a reply that is
 * coming, the answers once checked against the event's questions.
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
        ageGroup: ageGroupSchema.optional(),
        diet: z
          .array(dietNeedSchema)
          .max(dietNeedSchema.options.length)
          .optional(),
        dietOther: z.string().trim().max(RSVP_ANSWER_MAX).optional(),
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
