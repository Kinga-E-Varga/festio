import { z } from "zod";
import { idSchema, momentSchema, rsvpStatusSchema } from "@/db/schemas/common";

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

export type ReplyDoc = z.infer<typeof replySchema>;
export type Person = z.infer<typeof personSchema>;
