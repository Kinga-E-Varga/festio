import { refresh } from "next/cache";
import type { z } from "zod";
import { requireHostId } from "@/db/reads/session";
import { refusal, type SaveError } from "@/db/writes/save";
import type { ActionResult } from "@/types/actions";

/*
 * Not `"use server"`: a helper the host's actions share, not an action itself.
 * The event's owner is not checked here: every write starts with `ownEvent`,
 * inside its transaction, which refuses someone else's event as not found.
 */

/** A save that returns nothing answers `undefined`, as `ActionResult` spells it. */
type Saved<T> = T extends void ? undefined : T;

/**
 * One host save: signed in (else to sign-in), the input checked by its
 * schema, then `save`. A refusal becomes its reason, anything else `failed`.
 * On success the page is read again, unless `refresh: false`.
 */
export async function hostSave<S extends z.ZodType, T>(
  schema: S,
  input: unknown,
  save: (hostId: string, data: z.infer<S>) => Promise<T>,
  { refresh: again = true }: { refresh?: boolean } = {},
): Promise<ActionResult<Saved<T>, SaveError>> {
  const hostId = await requireHostId();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, error: "invalid" };

  try {
    const data = await save(hostId, parsed.data);
    if (again) refresh();
    return { success: true, data: data as Saved<T> };
  } catch (error) {
    return refusal(error);
  }
}
