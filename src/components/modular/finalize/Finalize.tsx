"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Dialog, DialogActions } from "@/components/dashboard/Dialog";
import type { ToastTone } from "@/components/dashboard/Toast";
import { StripButton } from "@/components/invitation/EditorFrame";
import {
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
  ERROR,
  INPUT,
} from "@/components/dashboard/styles";
import type { Language } from "@/lib/language";
import { draftId, type TemplateDraft } from "@/lib/template-draft";
import type { ModularState } from "@/types/modular";

export interface FinalizeProps {
  state: ModularState;
  /** The template the Design tab shows as current: what an update replaces. */
  from: string;
  language: Language;
  /** The editor's toast. */
  onDone: (message: string, tone?: ToastTone) => void;
}

type FormValues = Pick<TemplateDraft, "name" | "mode">;

/**
 * Dev only: the template preview's Finalize, a strip button in the bottom-left corner. Saves what the editor
 * shows as `drafts/templates/<id>.json` for the `template` skill, as a new
 * template or an update of the current one. English only, never shipped.
 */
export function Finalize({ state, from, language, onDone }: FinalizeProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-[60]">
        <StripButton
          icon="templates"
          label="Finalize"
          onClick={() => setOpen(true)}
        />
      </div>
      {open ? (
        <FinalizeDialog
          state={state}
          from={from}
          language={language}
          onDone={(message, tone) => {
            if (tone !== "error") setOpen(false);
            onDone(message, tone);
          }}
          onCancel={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function FinalizeDialog({
  state,
  from,
  language,
  onDone,
  onCancel,
}: FinalizeProps & { onCancel: () => void }) {
  const { register, handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: { name: "", mode: "new" },
  });
  const [mode, name] = useWatch({ control, name: ["mode", "name"] });

  async function send(values: FormValues) {
    const draft: TemplateDraft = { ...values, from, language, state };
    try {
      const response = await fetch("/api/dev/template-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = (await response.json()) as {
        file?: string;
        error?: string;
      };
      if (!response.ok) onDone(result.error ?? "Not saved.", "error");
      else onDone(`Draft saved: ${result.file}`);
    } catch {
      onDone("Not saved: the dev server didn't answer.", "error");
    }
  }

  return (
    <Dialog
      title="Finalize template"
      hint="Saves this design as a draft for Claude to turn into a template file."
      onDismiss={onCancel}
    >
      <form onSubmit={handleSubmit(send)} className="mt-4 flex flex-col gap-4">
        <fieldset className="flex flex-col gap-1.5 row-text">
          <label className="flex items-center gap-2">
            <input type="radio" value="new" {...register("mode")} />A new
            template
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="update" {...register("mode")} />
            An update of “{from}”
          </label>
        </fieldset>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="finalize-name" className="label-caps">
            Name
          </label>
          <input
            id="finalize-name"
            {...register("name", {
              validate: (value) => value.trim().length > 0 || "Give it a name.",
            })}
            maxLength={60}
            className={INPUT}
          />
          {formState.errors.name ? (
            <p className={ERROR}>{formState.errors.name.message}</p>
          ) : (
            <p className="hint-text">
              Saved as drafts/templates/
              {draftId({ name, mode, from }) || "…"}.json
            </p>
          )}
        </div>
        <DialogActions>
          <button type="button" onClick={onCancel} className={BTN_GHOST_LIGHT}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className={BTN_PRIMARY}
          >
            Save draft
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
