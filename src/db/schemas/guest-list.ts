import { z } from "zod";
import { idSchema, versionSchema } from "@/db/schemas/common";

/**
 * One name the host pre-loads. Its ID is permanent, so the name can be seated
 * before the guest replies.
 */
export const listNameSchema = z.object({
  id: idSchema,
  name: z.string().trim().min(1),
  /** The host has sent this person an invitation. */
  sent: z.boolean(),
});

/**
 * `events/{eventId}/guestList/names` — every pre-loaded name, in the host's
 * order, so the list is one read. Missing = no names yet. One `version` for
 * the whole list.
 */
export const guestListSchema = z.object({
  names: z
    .array(listNameSchema)
    .refine(
      (names) => new Set(names.map((name) => name.id)).size === names.length,
      "Name IDs must be unique",
    ),
  version: versionSchema,
});

export type GuestListDoc = z.infer<typeof guestListSchema>;
