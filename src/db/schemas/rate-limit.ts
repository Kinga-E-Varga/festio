import { z } from "zod";
import { countSchema, momentSchema } from "@/db/schemas/common";

/**
 * `rateLimits/{key}` — one tiny card per visitor + link + hour, keyed by a
 * hashed IP (never the real one). A TTL policy on `expiresAt` deletes it.
 */
export const rateLimitSchema = z.object({
  /** What's being counted. */
  action: z.enum(["reply", "password"]),
  count: countSchema,
  expiresAt: momentSchema,
});

export type RateLimitDoc = z.infer<typeof rateLimitSchema>;
