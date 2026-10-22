import { z } from "zod";
import { idSchema, momentSchema } from "@/db/schemas/common";

/**
 * `payments/{paymentId}` — outside the event, so it survives the GDPR
 * deletion. No guest data. Only the server writes it.
 */
export const paymentSchema = z.object({
  hostId: idSchema,
  eventId: idSchema,
  /** Upgrades pay the difference: one product per step. */
  product: z.enum(["freeToStandard", "freeToCustom", "standardToCustom"]),
  /** In the currency's smallest unit (bani, cents). */
  amount: z.number().int().nonnegative(),
  /** ISO 4217, e.g. `RON`. */
  currency: z.string().length(3),
  date: momentSchema,
  /** The provider's order number. */
  orderId: z.string().min(1),
  status: z.enum(["paid", "failed", "refunded"]),
});

export type PaymentDoc = z.infer<typeof paymentSchema>;
