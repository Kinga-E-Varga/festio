"use server";

import { refresh } from "next/cache";
import { hostEvent } from "@/db/reads/access";
import { requireHostId } from "@/db/reads/session";
import {
  guestChangesSchema,
  setGuestListOn,
  writeGuestChanges,
} from "@/db/writes/guests";
import { refusal, type SaveError } from "@/db/writes/save";
import type { ActionResult } from "@/types/actions";
import type { GuestChanges } from "@/types/guests";

/** Saves the guest list's changes; on success, each saved name's new version. */
export async function saveGuestChanges(
  eventId: string,
  changes: GuestChanges,
): Promise<ActionResult<{ versions: Record<string, number> }, SaveError>> {
  const hostId = await requireHostId();
  if (!(await hostEvent(eventId))) return { success: false, error: "notFound" };
  const parsed = guestChangesSchema.safeParse(changes);
  if (!parsed.success) return { success: false, error: "invalid" };

  try {
    const data = await writeGuestChanges(
      hostId,
      eventId,
      parsed.data,
      new Date(),
    );
    refresh();
    return { success: true, data };
  } catch (error) {
    return refusal(error);
  }
}

/** The guest page's list switch, saved as the event's `preloaded`. */
export async function saveGuestListOn(
  eventId: string,
  on: boolean,
): Promise<ActionResult<undefined, SaveError>> {
  const hostId = await requireHostId();
  if (!(await hostEvent(eventId))) return { success: false, error: "notFound" };
  if (typeof on !== "boolean") return { success: false, error: "invalid" };

  try {
    await setGuestListOn(hostId, eventId, on);
    refresh();
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
}
