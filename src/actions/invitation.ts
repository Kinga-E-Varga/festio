"use server";

import { z } from "zod";
import {
  questionsInputSchema,
  type Question,
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
  /** The modular editor's reply questions, archived ones too; a simple editor sends none. */
  questions: questionsInputSchema.optional(),
});

/**
 * Saves an invitation editor's card, and a modular one's reply questions;
 * on success, its new version, the questions as saved and the ones kept
 * against the host's change, and the page is read again. The card must be
 * the kind the event's template is; a simple card keeps only the
 * template's own fields and takes no questions.
 */
export async function saveInvitation(
  eventId: string,
  input: { card: InvitationDoc; questions?: QuestionInput[] },
): Promise<
  ActionResult<
    { version: number; questions: Question[]; kept: string[] },
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
        if (
          !loaded ||
          loaded.template.kind !== data.kind ||
          (questions && data.kind !== "modular")
        ) {
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
