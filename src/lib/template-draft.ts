import { z } from "zod";
import { modularInvitationSchema } from "@/db/schemas/invitation";
import { LANGUAGES } from "@/lib/language";
import { normalizeSlug, SLUG_PATTERN } from "@/lib/slug";

/**
 * Dev only: what the template preview's Finalize sends — a modular template
 * built in the editor, for Claude to turn into a template file (the
 * `template` skill). `new` makes a template of its own, named `name`;
 * `update` replaces `from`, the template the preview started from.
 */
export const templateDraftSchema = z.object({
  name: z.string().trim().min(1).max(60),
  mode: z.enum(["new", "update"]),
  from: z.string().regex(SLUG_PATTERN),
  /** The language the editor's text is written in; the skill writes the other two. */
  language: z.enum(LANGUAGES),
  state: modularInvitationSchema.omit({ kind: true, version: true }),
});

export type TemplateDraft = z.infer<typeof templateDraftSchema>;

/** The template's id: the starting one's for an update, the name's for a new one. */
export function draftId(draft: Pick<TemplateDraft, "name" | "mode" | "from">) {
  return draft.mode === "update" ? draft.from : normalizeSlug(draft.name);
}
