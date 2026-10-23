import { z } from "zod";
import { idSchema, momentSchema } from "@/db/schemas/common";

/**
 * `slugs/{slug}` — the link name is the card's ID. Claimed in a transaction,
 * so a second claim of the same name fails.
 */
export const slugDocSchema = z.object({
  eventId: idSchema,
  /**
   * Set when the event's data is deleted (one year) or the link changes
   * (`SLUG_BLOCK_DAYS`): the old link never opens that event, so old printed
   * cards never open a stranger's invitation. The same host can take it back;
   * once the date has passed, the link is free again.
   */
  blockedUntil: momentSchema.optional(),
});

export type SlugDoc = z.infer<typeof slugDocSchema>;
