"use server";

import { refresh } from "next/cache";
import { hostEvent } from "@/db/reads/access";
import { requireHostId } from "@/db/reads/session";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { writeInvitation } from "@/db/writes/invitation";
import { refusal, type SaveError } from "@/db/writes/save";
import { loadTemplate } from "@/templates";
import type { ActionResult } from "@/types/actions";

/**
 * Saves an invitation editor's card; on success, its new version, and the
 * page is read again. The card must be the kind the event's template is; a
 * simple card keeps only the template's own fields.
 */
export async function saveInvitation(
  eventId: string,
  input: InvitationDoc,
): Promise<ActionResult<{ version: number }, SaveError>> {
  const hostId = await requireHostId();
  const event = await hostEvent(eventId);
  if (!event) return { success: false, error: "notFound" };
  const parsed = invitationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "invalid" };

  const loaded = event.templateId ? await loadTemplate(event.templateId) : null;
  if (!loaded || loaded.template.kind !== parsed.data.kind) {
    return { success: false, error: "invalid" };
  }

  let card = parsed.data;
  if (card.kind === "simple" && loaded.template.kind === "simple") {
    const ids = new Set(loaded.template.fields.map(({ id }) => id));
    const values = Object.fromEntries(
      Object.entries(card.values).filter(([id]) => ids.has(id)),
    );
    card = { ...card, values };
  }

  try {
    const data = await writeInvitation(hostId, eventId, card);
    refresh();
    return { success: true, data };
  } catch (error) {
    return refusal(error);
  }
}
