"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  BAR_DISABLED,
  BAR_OUTLINE,
  BAR_SOLID,
  stateDot,
} from "@/components/dashboard/event-editor/styles";
import type { EventForm } from "@/components/dashboard/event-editor/useEventForm";

/**
 * What the bar reports depends on edits made and warnings still to be read.
 * Hands back the message key and its values; the bar translates it.
 */
function stateLabel(form: EventForm): {
  key:
    "stateLocked" | "stateSaved" | "stateClean" | "statePending" | "stateDirty";
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
    // Narrow, the status takes its own line and everything centres.
    <div className="sticky bottom-0 z-20 mt-10 flex flex-wrap items-center justify-center gap-4 border-t-2 border-mustard-400 bg-neutral-900 px-[18px] py-3.5 @min-[560px]:justify-start">
      <span className="flex flex-[100%] items-center justify-center gap-[9px] text-[12.5px] text-neutral-300 @min-[560px]:flex-1 @min-[560px]:justify-start">
        <span aria-hidden="true" className={stateDot(form.save.dirty)} />
        <span role="status">{t(state.key, { count: state.count ?? 0 })}</span>
      </span>

      <Link href="/dashboard/events" className={BAR_OUTLINE}>
        {t("back")}
      </Link>

      <button
        type="button"
        disabled={!form.save.canSave}
        onClick={onSave}
        className={form.save.canSave ? BAR_SOLID : BAR_DISABLED}
      >
        {t("save")}
      </button>
    </div>
  );
}
