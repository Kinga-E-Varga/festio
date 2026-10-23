import { z } from "zod";
import { idSchema } from "@/db/schemas/common";
import { guestListSchema } from "@/db/schemas/guest-list";
import { replySchema } from "@/db/schemas/reply";

/*
 * One guest-list save as the host's page sends it: not a card, but checked
 * before anything is read (`writeGuestChanges`).
 */

/** A reply card as the host sends it: the server sets when, by whom and the edit time. */
const replyInputSchema = replySchema
  .omit({ sentAt: true, createdBy: true, editedAt: true })
  .extend({
    id: idSchema,
    /** A card not saved yet; otherwise the card must still be there. */
    isNew: z.boolean(),
    /** The card its people came from, for a new card made by Separate from group. */
    from: idSchema.optional(),
  });

export const guestChangesSchema = z.object({
  replies: z.object({
    put: z.array(replyInputSchema),
    remove: z.array(idSchema),
  }),
  /** The whole list as it should be saved, at the version the page read; null = unchanged. */
  list: guestListSchema.nullable(),
});

export type GuestChanges = z.infer<typeof guestChangesSchema>;
export type ReplyInput = z.infer<typeof replyInputSchema>;
