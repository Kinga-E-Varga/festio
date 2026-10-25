"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { STRIP_ICON } from "@/components/dashboard/styles";
import { Toast, type ToastTone } from "@/components/dashboard/Toast";
import { Icon } from "@/components/icons";
import { useLeaveFestio } from "@/lib/history";
import type { IconName } from "@/types/dashboard";

/**
 * The editor's main action. The editors save; the print page has nothing to
 * save, so it exports.
 */
export type EditorAction =
  | {
      kind: "save";
      /** Unsaved changes; Save is off without them. */
      dirty: boolean;
      onSave: () => void;
    }
  | { kind: "export"; onExport: () => void };

/** One of the side panel's views, as a button on the strip. */
export interface StripView<Id extends string = string> {
  id: Id;
  label: string;
  icon: IconName;
}

/** The side panel the strip's views open (`SidePanel`). */
export const EDITOR_PANEL_ID = "editor-panel";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500";

/** The strip's icon and circle, a step smaller while it is the 56px top bar. */
const ITEM_ICON = { ...STRIP_ICON, className: "size-5 invite:size-[22px]" };
const ITEM_CIRCLE = "size-8 invite:size-btn";

/** A strip button: its icon over its label. */
const STRIP_ITEM = `group flex w-16 flex-col items-center gap-0.5 rounded-ui text-neutral-900 hover:text-neutral-950 aria-expanded:text-neutral-950 ${FOCUS}`;
/**
 * The icon's circle, the dashboard strip's (`BAR_ICON`): tinted on hover,
 * gold while its view is open. Only the icon, never the label.
 */
const STRIP_CIRCLE = `grid ${ITEM_CIRCLE} place-items-center rounded-full transition-colors group-hover:bg-secondary-400/30 group-aria-expanded:bg-secondary-400`;
/** The strip's short rule above Quit; none in the top bar. */
const DIVIDER = "hidden w-12 border-t border-neutral-300 invite:block";
const STRIP_LABEL = "text-[11px] leading-tight font-medium";

interface EditorStripProps<Id extends string> {
  views: readonly StripView<Id>[];
  view: Id;
  open: boolean;
  onView: (id: Id) => void;
  onClose: () => void;
  action: EditorAction;
  backTo?: string;
}

/**
 * The editor's strip down the right edge, built like the dashboard's
 * right-hand strip but labelled, as hosts meet it rarely: Save (faded while
 * there is nothing to save) or Export on top, then the panel's views (each
 * opens the panel on it, the open one closes it), one column with one gap,
 * and Quit editor at the foot under a short rule. Where the panel covers the
 * page (below `--breakpoint-invite`) it turns into a bar across the top, the
 * panel opening under it: Quit at the left, the views, Save at the right. Not along the bottom, where the simple
 * invitation's own reply bar sits. Festio's own chrome, never the
 * invitation's.
 */
function EditorStrip<Id extends string>({
  views,
  view,
  open,
  onView,
  onClose,
  action,
  backTo,
}: EditorStripProps<Id>) {
  const t = useTranslations("HostEditor");
  const quit = useLeaveFestio(backTo ?? "/dashboard");
  const save = action.kind === "save";
  const label = t(action.kind);

  return (
    <div className="flex shrink-0 items-center border-neutral-300 bg-neutral-125 font-sans max-invite:order-first max-invite:h-topbar max-invite:justify-between max-invite:border-b max-invite:px-2 invite:h-full invite:w-[72px] invite:flex-col invite:border-l invite:pt-chrome-top invite:pb-chrome-top">
      <div className="flex items-center max-invite:flex-1 max-invite:justify-evenly invite:flex-col invite:gap-5">
        {views.map((each) => {
          const current = open && view === each.id;
          return (
            <button
              key={each.id}
              type="button"
              aria-controls={EDITOR_PANEL_ID}
              aria-expanded={current}
              onClick={() => (current ? onClose() : onView(each.id))}
              className={STRIP_ITEM}
            >
              <span className={STRIP_CIRCLE}>
                <Icon name={each.icon} {...ITEM_ICON} />
              </span>
              <span className={STRIP_LABEL}>{each.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          disabled={save && !action.dirty}
          onClick={save ? action.onSave : action.onExport}
          className={`group flex w-16 flex-col items-center gap-0.5 text-neutral-900 disabled:cursor-not-allowed invite:order-first ${FOCUS}`}
        >
          <span
            className={`grid ${ITEM_CIRCLE} place-items-center rounded-full bg-accent-800 text-neutral-50 transition-colors group-hover:bg-accent-900 group-disabled:bg-accent-800 group-disabled:opacity-40`}
          >
            <Icon
              name={save ? "check" : "download"}
              className="size-5"
              strokeWidth={2}
            />
          </span>
          <span className={`${STRIP_LABEL} group-disabled:opacity-40`}>
            {label}
          </span>
        </button>
      </div>

      <div className="hidden flex-1 invite:block" />

      <div className="flex flex-col items-center max-invite:order-first">
        <div className={`mb-4 ${DIVIDER}`} />
        <button
          type="button"
          data-leaves
          onClick={quit}
          aria-label={t("quit")}
          title={t("quit")}
          className={STRIP_ITEM}
        >
          <span className={STRIP_CIRCLE}>
            <Icon name="quit" {...ITEM_ICON} />
          </span>
          <span aria-hidden="true" className={STRIP_LABEL}>
            {t("quitShort")}
          </span>
        </button>
      </div>
    </div>
  );
}

interface EditorFrameProps<Id extends string> extends EditorStripProps<Id> {
  toast: { message: string | null; tone: ToastTone };
  children: ReactNode;
}

/**
 * The editors' page: whatever the editor shows, filling the screen, with the
 * strip at its right edge and the side panel opening beside it (below the
 * breakpoint, the strip as a top bar and the panel under it), and its
 * toasts. Shared by the simple and the modular editor and the print page.
 */
export function EditorFrame<Id extends string>({
  toast,
  children,
  ...strip
}: EditorFrameProps<Id>) {
  return (
    <>
      <div className="flex h-dvh flex-col invite:flex-row">
        {/*
         * Clipped at the strip, so the closed panel parked past the page's
         * edge stays out of sight rather than lying over the strip.
         */}
        <div className="min-h-0 min-w-0 flex-1 overflow-clip">{children}</div>
        <EditorStrip {...strip} />
      </div>
      <Toast message={toast.message} tone={toast.tone} />
    </>
  );
}
