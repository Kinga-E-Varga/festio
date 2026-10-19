import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BackButton } from "@/components/dashboard/BackButton";
import {
  BAR_DISABLED,
  BAR_OUTLINE,
  BAR_SOLID,
  stateDot,
} from "@/components/dashboard/event-editor/styles";
import { TOP_BAR } from "@/components/dashboard/styles";
import { Toast, type ToastTone } from "@/components/dashboard/Toast";
import { ButtonIcon } from "@/components/icons";

/**
 * The bar's last button. The editors save, with the save status beside it;
 * the print page has nothing to save, so it exports and shows no status.
 */
export type EditorAction =
  | {
      kind: "save";
      /** Unsaved changes; Save is off without them. */
      dirty: boolean;
      /** Saved and not changed since — "Saved just now" in place of "No changes to save". */
      justSaved: boolean;
      onSave: () => void;
    }
  | { kind: "export"; onExport: () => void };

interface EditorTopBarProps {
  title: string;
  editing: boolean;
  onToggleEdit: () => void;
  action: EditorAction;
}

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-400";

/**
 * The editors' top bar, shared by the simple and the modular editor and the
 * print page. Festio's
 * own chrome — app fonts and palette, never the invitation's. One button
 * switches between editing and viewing, and says where it takes the host:
 * View while the panel is open, Edit while it is closed.
 */
export function EditorTopBar({
  title,
  editing,
  onToggleEdit,
  action,
}: EditorTopBarProps) {
  const t = useTranslations("HostEditor");
  const tState = useTranslations("EventEditor");
  // Save is off without changes; Export always works.
  const disabled = action.kind === "save" && !action.dirty;

  return (
    <header className={TOP_BAR}>
      <div className="flex shrink-0">
        <BackButton tone="dark" />
      </div>
      <div className="ml-0.5 h-8 shrink-0 border-l border-secondary-100/35 sm:ml-2.5" />
      {/*
       * At least 114px — this padding plus the bar's gap — before the save
       * status. Near the breakpoint the title gives way first and cuts itself
       * off. Below it the title is hidden and the save status takes the
       * space, from its left.
       */}
      <div className="hidden min-w-0 flex-1 items-center gap-3.5 lg:flex lg:pr-[100px]">
        {/*
         * Wide screens only, capped at 400px; the whole of it on hover. Below
         * the breakpoint the bar keeps the save status instead.
         */}
        <span
          title={title}
          className="max-w-[400px] truncate font-serif text-[15px]"
        >
          {title}
        </span>
      </div>
      {/*
       * The event editor's save bar status, word for word. Also what holds
       * the buttons to the right below the breakpoint, so it stays when
       * there is no status to show.
       */}
      <span className="flex min-w-0 flex-1 items-center gap-[9px] text-[12.5px] text-neutral-300 lg:flex-none lg:shrink-0">
        {action.kind === "save" && (
          <>
            <span
              aria-hidden="true"
              className={`hidden md:block ${stateDot(action.dirty)}`}
            />
            <span
              role="status"
              className="sr-only text-neutral-100 md:not-sr-only"
            >
              {tState(
                action.dirty
                  ? "stateDirty"
                  : action.justSaved
                    ? "stateSaved"
                    : "stateClean",
              )}
            </span>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={onToggleEdit}
        className={`${BAR_OUTLINE} shrink-0 gap-1.5 ${FOCUS}`}
      >
        <ButtonIcon name={editing ? "eye" : "pencil"} />
        {editing ? t("view") : t("edit")}
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={action.kind === "save" ? action.onSave : action.onExport}
        className={`${disabled ? BAR_DISABLED : BAR_SOLID} shrink-0 gap-1.5 ${FOCUS}`}
      >
        <ButtonIcon name={action.kind === "save" ? "check" : "download"} />
        {t(action.kind)}
      </button>
    </header>
  );
}

interface EditorFrameProps extends EditorTopBarProps {
  toast: { message: string | null; tone: ToastTone };
  children: ReactNode;
}

/**
 * The editors' page: the top bar, then whatever the editor shows filling the
 * rest of the screen, and its toasts. Shared by the simple and the modular
 * editor and the print page.
 */
export function EditorFrame({ toast, children, ...bar }: EditorFrameProps) {
  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar {...bar} />
      <div className="min-h-0 flex-1">{children}</div>
      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
