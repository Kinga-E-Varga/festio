import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BAR_DARK } from "@/components/dashboard/event-editor/styles";
import { XIcon } from "./icons";
import { PANEL } from "./styles";

interface SidePanelProps {
  /** `edit` for the invitation editor, `sheet-form` for the print page — see `globals.css`. */
  panelClassName: string;
  open: boolean;
  /** The invitation editor takes the reply panel out of the tab order while closed; the print page has nothing behind it to protect. */
  inert?: boolean;
  /** Tabs across the header, beside the X. The print page has none. */
  tabs?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The host's slide-in form: an aside sized and animated by `panelClassName`,
 * the header's close `X` while it covers the viewport, and the caller's own
 * fields. Shared by the
 * invitation editors and the print page, which take the same shell and differ
 * only in which fields fill it.
 *
 * Festio's own chrome, never the invitation's palette: the dashboard's
 * Activity rail — its fill and its edge — in the app's face and ink. No
 * shadow: the edge line alone sets it apart from the page.
 */
export function SidePanel({
  panelClassName,
  open,
  inert,
  tabs,
  onClose,
  children,
}: SidePanelProps) {
  return (
    <aside
      className={`${panelClassName} ${PANEL} border-l border-mustard-300 bg-mustard-100 font-sans text-neutral-900`}
      data-open={open}
      inert={inert}
    >
      {/*
       * The header runs edge to edge and sticks to the top as the fields
       * scroll under it, on the panel's own surface so they don't show
       * through. With no tabs (the print page) it holds only the X, so it
       * shows only while the panel covers the viewport.
       */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/*
         * With tabs, the gap under them belongs to the sticky header, so a
         * long form scrolls out of sight a gap below the tabs' line rather
         * than right against it.
         */}
        <div
          className={`sticky top-0 z-10 bg-mustard-100 ${tabs ? "pb-8" : "invite:hidden"}`}
        >
          <Header tabs={tabs} onClose={onClose} />
        </div>
        <div
          className={`flex flex-1 flex-col p-5 invite:p-8 ${tabs ? "pt-0 invite:pt-0" : "pt-8"}`}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}

/**
 * The row of tabs, ended by the X — or the X alone on the print page. The X is
 * there only below the breakpoint, where the panel covers the viewport;
 * beside the card or paper the top bar's View closes it.
 */
function Header({ tabs, onClose }: { tabs?: ReactNode; onClose: () => void }) {
  const t = useTranslations("HostEditor");

  return (
    /*
     * A divider between the tabs and the X: the X closes the panel, it is
     * not a fourth tab. Without tabs a tab-tall space keeps the row's height
     * and pushes the X to the end.
     */
    <header className="mx-3 flex shrink-0 items-center border-b border-neutral-700 pt-3 font-sans">
      {tabs ? (
        <>
          {tabs}
          <span
            aria-hidden="true"
            className="mx-1.5 h-6 w-px shrink-0 bg-neutral-700/100 invite:hidden"
          />
        </>
      ) : (
        <span className="h-10 flex-1" />
      )}
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-xs text-neutral-900 transition-colors hover:bg-mustard-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel-500 invite:hidden"
      >
        <XIcon size={14} />
      </button>
    </header>
  );
}

/**
 * View at the foot of the form: the same exit as the header's X and the top
 * bar's View, at every width.
 */
export function PanelViewButton({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  const t = useTranslations("HostEditor");

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        className={`${BAR_DARK} flex-1 mb-6 ${className}`}
      >
        {t("view")}
      </button>
    </div>
  );
}
