"use client";

import Link from "next/link";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";

const BUTTON =
  "inline-flex items-center justify-center rounded-md border px-4 py-2.5 font-medium transition-colors";

/** What the bar reports depends on edits made and warnings still to be read. */
function stateLabel(form: EventForm): string {
  if (form.locked) return "Editing closed — nothing here can be changed";
  if (!form.save.dirty) {
    return form.save.justSaved ? "Saved just now" : "No changes to save";
  }
  if (form.save.pending > 0) {
    return form.save.pending === 1
      ? "Tick the box in the warning above to save"
      : `Tick the box in all ${form.save.pending} warnings above to save`;
  }
  return "Unsaved changes";
}

interface SaveBarProps {
  form: EventForm;
  /** Saves and announces it; the bar itself only reports state. */
  onSave: () => void;
}

export function SaveBar({ form, onSave }: SaveBarProps) {
  return (
    // Docked to the bottom of the viewport, so it stays reachable to the end.
    <div className="sticky bottom-0 z-20 mt-10 flex flex-wrap items-center gap-4 border-t-2 border-mustard-500 bg-neutral-900 px-[18px] py-3.5">
      <span className="flex flex-[100%] items-center gap-[9px] text-[12.5px] text-neutral-300 @min-[560px]:flex-1">
        <span
          aria-hidden="true"
          className={`size-[7px] shrink-0 rounded-full ${
            form.save.dirty ? "bg-terracotta-400" : "bg-forest-400"
          }`}
        />
        <span role="status">{stateLabel(form)}</span>
      </span>

      <Link
        href="/dashboard/events"
        className={`${BUTTON} border-mustard-500 bg-transparent text-mustard-500 hover:bg-mustard-50/10`}
      >
        Back to events
      </Link>

      <button
        type="button"
        disabled={!form.save.canSave}
        onClick={onSave}
        className={`${BUTTON} ${
          form.save.canSave
            ? "border-mustard-500 bg-mustard-500 font-semibold text-neutral-950 hover:border-mustard-400 hover:bg-mustard-400"
            : "cursor-not-allowed border-neutral-800 bg-transparent text-neutral-700"
        }`}
      >
        Save changes
      </button>
    </div>
  );
}
