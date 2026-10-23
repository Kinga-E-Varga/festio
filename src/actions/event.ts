"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { CANCEL_MESSAGE_MAX } from "@/db/limits";
import { hostEvent } from "@/db/reads/access";
import { freshSignIn, requireHostId } from "@/db/reads/session";
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
import { refusal, type SaveError } from "@/db/writes/save";
import { isPast } from "@/lib/event";
import type { ActionResult } from "@/types/actions";
import type { PrintSettings } from "@/types/print";

/** The browser's fresh sign-in, proof it's the host before a step that can't be undone. */
const idTokenSchema = z.string().min(1);

/** Saves Event settings; on success, the card's new version, and the page is read again. */
export async function saveEventSettings(
  eventId: string,
  input: EventSettings,
): Promise<ActionResult<{ version: number }, SaveError>> {
  const hostId = await requireHostId();
  if (!(await hostEvent(eventId))) return { success: false, error: "notFound" };
  const parsed = eventSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "invalid" };

  try {
    const data = await writeEventSettings(
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

/** Keeps the printable's settings when the host exports it. The print editor holds its own state, so no refresh. */
export async function savePrintSettings(
  eventId: string,
  print: PrintSettings,
): Promise<ActionResult<undefined, SaveError>> {
  const hostId = await requireHostId();
  if (!(await hostEvent(eventId))) return { success: false, error: "notFound" };
  const parsed = printSettingsSchema.safeParse(print);
  if (!parsed.success) return { success: false, error: "invalid" };

  try {
    await writePrintSettings(hostId, eventId, parsed.data);
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
}

/**
 * Cancels an event that hasn't happened yet: its invitation shows the
 * host's message instead. The host signed in again just now to confirm it.
 */
export async function cancelEvent(
  eventId: string,
  input: { message: string; idToken: string },
): Promise<ActionResult<undefined, SaveError>> {
  const hostId = await requireHostId();
  const event = await hostEvent(eventId);
  if (!event) return { success: false, error: "notFound" };
  const parsed = z
    .object({ message: z.string(), idToken: idTokenSchema })
    .safeParse(input);
  if (!parsed.success) return { success: false, error: "invalid" };
  const message = parsed.data.message.trim();
  if (
    isPast(event) ||
    event.cancelled ||
    message.length === 0 ||
    message.length > CANCEL_MESSAGE_MAX
  ) {
    return { success: false, error: "notAllowed" };
  }
  if (!(await freshSignIn(parsed.data.idToken))) {
    return { success: false, error: "wrongPassword" };
  }

  try {
    await writeCancel(hostId, eventId, message, new Date());
    refresh();
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
}

/** Takes a cancel back while the event's data is still kept and its day hasn't passed. */
export async function reopenEvent(
  eventId: string,
): Promise<ActionResult<undefined, SaveError>> {
  const hostId = await requireHostId();
  const event = await hostEvent(eventId);
  if (!event) return { success: false, error: "notFound" };
  if (!event.cancelled || event.dataDeleted || isPast(event)) {
    return { success: false, error: "notAllowed" };
  }

  try {
    await writeReopen(hostId, eventId);
    refresh();
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
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
  await requireHostId();
  const event = await hostEvent(eventId);
  if (!event) return { success: false, error: "notFound" };
  const parsed = z.object({ idToken: idTokenSchema }).safeParse(input);
  if (!parsed.success) return { success: false, error: "invalid" };
  if (!(isPast(event) || event.cancelled) || event.dataDeleted) {
    return { success: false, error: "notAllowed" };
  }
  if (!(await freshSignIn(parsed.data.idToken))) {
    return { success: false, error: "wrongPassword" };
  }

  try {
    await deleteEventData(eventId, new Date());
    return { success: true, data: undefined };
  } catch (error) {
    return refusal(error);
  }
}
