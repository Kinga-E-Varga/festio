import { z } from "zod";
import { idSchema, versionSchema } from "@/db/schemas/common";

/**
 * `events/{eventId}/seating/chart` — the whole chart, saved all at once and
 * only by the host. Warnings are worked out live, never stored.
 *
 * The seating printables' settings (`print`) join once their options are decided.
 */
export const seatingSchema = z.object({
  /** In the host's order. */
  tables: z.array(
    z.object({
      id: idSchema,
      name: z.string().trim().min(1),
      seats: z.number().int().positive(),
    }),
  ),
  /**
   * By person ID (a reply's person or a pre-loaded name), so one person sits
   * at one table. `name` is a copy at save time, for warnings about someone deleted.
   */
  seats: z.record(z.string(), z.object({ table: idSchema, name: z.string() })),
  version: versionSchema,
});

export type SeatingDoc = z.infer<typeof seatingSchema>;
