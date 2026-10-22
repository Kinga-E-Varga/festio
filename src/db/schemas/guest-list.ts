import { z } from "zod";
import { versionSchema } from "@/db/schemas/common";

/**
 * `events/{eventId}/guestList/{nameId}` — one name the host pre-loads. The
 * card's ID is permanent, so the name can be seated before the guest replies.
 */
export const guestListNameSchema = z.object({
  name: z.string().trim().min(1),
  /** The host has sent this person an invitation. */
  sent: z.boolean(),
  version: versionSchema,
});

export type GuestListNameDoc = z.infer<typeof guestListNameSchema>;
