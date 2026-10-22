import type { z } from "zod";
import type { printSettingsSchema, printShapeSchema } from "@/db/schemas/event";

/**
 * The two ways a printable is put on paper. A flat card is one sheet printed
 * on both sides; a folded one is the same sheet folded in half, so it carries
 * four faces instead of two.
 */
export type PrintShape = z.infer<typeof printShapeSchema>;

/** What the host sets up on the print page, before anything is rendered out. */
export type PrintSettings = z.infer<typeof printSettingsSchema>;
