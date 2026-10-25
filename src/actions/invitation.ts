"use server";

import { z } from "zod";
import {
  questionsInputSchema,
  type StoredQuestion,
  type QuestionInput,
} from "@/db/schemas/event";
import { invitationSchema, type InvitationDoc } from "@/db/schemas/invitation";
import { writeInvitation } from "@/db/writes/invitation";
import { SaveRefused, type SaveError } from "@/db/writes/save";
import { hostSave } from "@/actions/host-save";
import { loadTemplate } from "@/templates";
import type { ActionResult } from "@/types/actions";

const saveSchema = z.object({
  card: invitationSchema,
  /** The editor's reply questions, archived ones too; sent by the simple and the modular editor alike. */
  questions: questionsInputSchema.optional(),
});

/**
 * Saves an invitation editor's card and its reply questions;
 * on success, its new version, the questions as saved and the ones kept
 * against the host's change, and the page is read again. The card must be
 * the kind the event's template is; a simple card keeps only the
 * template's own fields.
 */
export async function saveInvitation(
  eventId: string,
  input: { card: InvitationDoc; questions?: QuestionInput[] },
): Promise<
  ActionResult<
    { version: number; questions: StoredQuestion[]; kept: string[] },
    SaveError
  >
> {
  return hostSave(saveSchema, input, (hostId, { card: data, questions }) =>
    writeInvitation(
      hostId,
      eventId,
      async (event) => {
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
      },
      questions,
    ),
  );
}
