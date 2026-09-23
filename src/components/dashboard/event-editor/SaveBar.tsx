"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";

const BUTTON =
  "inline-flex items-center justify-center rounded-md border px-4 py-2.5 font-medium transition-colors";

/**
 * What the bar reports depends on edits made and warnings still to be read.
 * Hands back the message key and its values; the bar translates it.
 */
function stateLabel(form: EventForm): {
  key: "stateLocked" | "stateSaved" | "stateClean" | "statePending" | "stateDirty";
  count?: number;
} {
  if (form.locked) return { key: "stateLocked" };
  if (!form.save.dirty) {
    return { key: form.save.justSaved ? "stateSaved" : "stateClean" };
  }
  if (form.save.pending > 0) {
    return { key: "statePending", count: form.save.pending };
  }
  return { key: "stateDirty" };
}

interface SaveBarProps {
  form: EventForm;
  /** Saves and announces it; the bar itself only reports state. */
  onSave: () => void;
}

export function SaveBar({ form, onSave }: SaveBarProps) {
  const t = useTranslations("EventEditor");
  const state = stateLabel(form);

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
        <span role="status">{t(state.key, { count: state.count ?? 0 })}</span>
      </span>

      <Link
        href="/dashboard/events"
        className={`${BUTTON} border-mustard-500 bg-transparent text-mustard-500 hover:bg-mustard-50/10`}
      >
        {t("back")}
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
        {t("save")}
      </button>
    </div>
  );
}
