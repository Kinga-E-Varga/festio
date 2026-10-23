"use server";

import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { writeInvitation } from "@/db/writes/invitation";
import { SaveRefused, type SaveError } from "@/db/writes/save";
import { hostSave } from "@/actions/host-save";
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
  return hostSave(invitationSchema, input, (hostId, data) =>
    writeInvitation(hostId, eventId, async (event) => {
      const loaded = event.templateId
        ? await loadTemplate(event.templateId)
        : null;
      if (!loaded || loaded.template.kind !== data.kind) {
        throw new SaveRefused("invalid");
      }
      if (data.kind !== "simple" || loaded.template.kind !== "simple") {
        return data;
      }
      const ids = new Set(loaded.template.fields.map(({ id }) => id));
      const values = Object.fromEntries(
        Object.entries(data.values).filter(([id]) => ids.has(id)),
      );
      return { ...data, values };
    }),
  );
}
