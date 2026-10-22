import { z } from "zod";
import { languageSchema, momentSchema } from "@/db/schemas/common";

/**
 * `users/{uid}` — what Festio needs on top of the Auth login. No list of
 * events: each event card names its host.
 */
export const userSchema = z.object({
  name: z.string().trim().min(1),
  /** The app language the host last chose. */
  language: languageSchema,
  joinedAt: momentSchema,
  /** Proof of the DPA; a new version can be asked for again. */
  terms: z.object({ version: z.string().min(1), acceptedAt: momentSchema }),
});

export type UserDoc = z.infer<typeof userSchema>;
