import { z } from "zod";
import { idSchema, momentSchema } from "@/db/schemas/common";

/**
 * `slugs/{slug}` — the link name is the card's ID. Claimed in a transaction,
 * so a second claim of the same name fails.
 */
export const slugDocSchema = z.object({
  eventId: idSchema,
  /**
   * Set when the event's data is deleted: the link stays blocked until then
   * (one year), so old printed cards never open a stranger's invitation.
   */
  blockedUntil: momentSchema.optional(),
});

export type SlugDoc = z.infer<typeof slugDocSchema>;
