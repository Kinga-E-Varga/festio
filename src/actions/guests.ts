"use server";

import { z } from "zod";
import {
  guestChangesSchema,
  setGuestListOn,
  writeGuestChanges,
} from "@/db/writes/guests";
import type { SaveError } from "@/db/writes/save";
import { hostSave } from "@/actions/host-save";
import type { ActionResult } from "@/types/actions";
import type { GuestChanges } from "@/types/guests";

/** Saves the guest list's changes; on success, each saved name's new version. */
export async function saveGuestChanges(
  eventId: string,
  changes: GuestChanges,
): Promise<ActionResult<{ versions: Record<string, number> }, SaveError>> {
  return hostSave(guestChangesSchema, changes, (hostId, data) =>
    writeGuestChanges(hostId, eventId, data, new Date()),
  );
}

/** The guest page's list switch, saved as the event's `preloaded`. */
export async function saveGuestListOn(
  eventId: string,
  on: boolean,
): Promise<ActionResult<undefined, SaveError>> {
  return hostSave(z.boolean(), on, (hostId, data) =>
    setGuestListOn(hostId, eventId, data),
  );
}
