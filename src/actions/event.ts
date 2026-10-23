"use server";

import { z } from "zod";
import { CANCEL_MESSAGE_MAX } from "@/db/limits";
import { hostEvent } from "@/db/reads/access";
import { freshSignIn } from "@/db/reads/session";
import {
  eventSettingsSchema,
  printSettingsSchema,
  type EventSettings,
} from "@/db/schemas/event";
import { deleteEventData } from "@/db/writes/delete-event";
import {
  writeCancel,
  writeEventSettings,
  writePrintSettings,
  writeReopen,
} from "@/db/writes/event";
import { SaveRefused, type SaveError } from "@/db/writes/save";
import { hostSave } from "@/actions/host-save";
import { isPast } from "@/lib/event";
import type { ActionResult } from "@/types/actions";
import type { PrintSettings } from "@/types/print";
import type { DashboardEvent } from "@/types/dashboard";

/** The browser's fresh sign-in, proof it's the host before a step that can't be undone. */
const idTokenSchema = z.string().min(1);

/**
 * The host's event, for the rules below that read its countdown. Step 8
 * moves those rules (past, cancelled) into the writes, and this read goes.
 */
async function eventForRules(eventId: string): Promise<DashboardEvent> {
  const event = await hostEvent(eventId);
  if (!event) throw new SaveRefused("notFound");
  return event;
}

/** Saves Event settings; on success, the card's new version, and the page is read again. */
export async function saveEventSettings(
  eventId: string,
  input: EventSettings,
): Promise<ActionResult<{ version: number }, SaveError>> {
  return hostSave(eventSettingsSchema, input, (hostId, data) =>
    writeEventSettings(hostId, eventId, data, new Date()),
  );
}

/** Keeps the printable's settings when the host exports it. The print editor holds its own state, so no refresh. */
export async function savePrintSettings(
  eventId: string,
  print: PrintSettings,
): Promise<ActionResult<undefined, SaveError>> {
  return hostSave(
    printSettingsSchema,
    print,
    (hostId, data) => writePrintSettings(hostId, eventId, data),
    { refresh: false },
  );
}

/**
 * Cancels an event that hasn't happened yet: its invitation shows the
 * host's message instead. The host signed in again just now to confirm it.
 */
export async function cancelEvent(
  eventId: string,
  input: { message: string; idToken: string },
): Promise<ActionResult<undefined, SaveError>> {
  const schema = z.object({ message: z.string(), idToken: idTokenSchema });
  return hostSave(
    schema,
    input,
    async (hostId, { idToken, message: typed }) => {
      const event = await eventForRules(eventId);
      const message = typed.trim();
      if (
        isPast(event) ||
        event.cancelled ||
        message.length === 0 ||
        message.length > CANCEL_MESSAGE_MAX
      ) {
        throw new SaveRefused("notAllowed");
      }
      if (!(await freshSignIn(idToken))) throw new SaveRefused("wrongPassword");
      await writeCancel(hostId, eventId, message, new Date());
    },
  );
}

/** Takes a cancel back while the event's data is still kept and its day hasn't passed. */
export async function reopenEvent(
  eventId: string,
): Promise<ActionResult<undefined, SaveError>> {
  return hostSave(z.undefined(), undefined, async (hostId) => {
    const event = await eventForRules(eventId);
    if (!event.cancelled || event.dataDeleted || isPast(event)) {
      throw new SaveRefused("notAllowed");
    }
    await writeReopen(hostId, eventId);
  });
}

/**
 * Deletes a past or cancelled event's data now, instead of waiting for
 * the nightly cleanup. Only a leftover of the card stays. The host signed in
 * again just now to confirm it.
 */
export async function deleteEventNow(
  eventId: string,
  input: { idToken: string },
): Promise<ActionResult<undefined, SaveError>> {
  return hostSave(
    z.object({ idToken: idTokenSchema }),
    input,
    async (_hostId, { idToken }) => {
      const event = await eventForRules(eventId);
      if (!(isPast(event) || event.cancelled) || event.dataDeleted) {
        throw new SaveRefused("notAllowed");
      }
      if (!(await freshSignIn(idToken))) {
        throw new SaveRefused("wrongPassword");
      }
      await deleteEventData(eventId, new Date());
    },
    { refresh: false },
  );
}
