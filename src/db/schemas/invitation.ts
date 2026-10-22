import { z } from "zod";
import { idSchema, versionSchema } from "@/db/schemas/common";

/**
 * `events/{eventId}/invitation/content` — the invitation's look and text, on
 * its own card so the dashboard never loads it and each editor saves its own.
 */

/** A simple invitation: the host's text by template field ID. */
const simpleInvitationSchema = z.object({
  kind: z.literal("simple"),
  values: z.record(z.string(), z.string()),
  version: versionSchema,
});

const listItemSchema = z.record(z.string(), z.string());

/** One section's content: text, a toggle, a list's items or a `groups` field's groups. */
const sectionValuesSchema = z.record(
  z.string(),
  z.union([
    z.string(),
    z.boolean(),
    z.array(listItemSchema),
    z.array(
      z.object({ values: listItemSchema, items: z.array(listItemSchema) }),
    ),
  ]),
);

/** A modular invitation: today's `ModularState`, ids only plus every section's values. */
const modularInvitationSchema = z.object({
  kind: z.literal("modular"),
  palette: idSchema,
  fontPair: idSchema,
  /** Null = a plain ground. */
  pattern: idSchema.nullable(),
  corners: idSchema,
  envelope: z.boolean(),
  sections: z.array(
    z.object({ section: idSchema, variant: idSchema, on: z.boolean() }),
  ),
  /** Every section's values, on or off. */
  values: z.record(z.string(), sectionValuesSchema),
  version: versionSchema,
});

export const invitationSchema = z.discriminatedUnion("kind", [
  simpleInvitationSchema,
  modularInvitationSchema,
]);

export type InvitationDoc = z.infer<typeof invitationSchema>;
