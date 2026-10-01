import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { BAR_SOLID } from "@/components/dashboard/event-editor/styles";
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
  /** In place of tabs, a heading in their row (the print page's). */
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The host's slide-in form: an aside sized and animated by `panelClassName`,
 * the header's close `X`, and the caller's own fields. Shared by the
 * invitation editors and the print page, which take the same shell and differ
 * only in which fields fill it.
 *
 * Festio's own chrome, never the invitation's palette: the dashboard's
 * Activity rail — its fill and its edge — in the app's face and ink, with the
 * panels' one shadow, `elevation-panel`, so the edge doesn't cut hard
 * against the page.
 */
export function SidePanel({
  panelClassName,
  open,
  inert,
  tabs,
  title,
  onClose,
  children,
}: SidePanelProps) {
  return (
    <aside
      className={`${panelClassName} ${PANEL} elevation-panel border-l border-mustard-300 bg-mustard-100 font-sans text-neutral-900`}
      data-open={open}
      inert={inert}
    >
      {/*
       * The header runs edge to edge and sticks to the top as the fields
       * scroll under it, on the panel's own surface so they don't show
       * through.
       */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="sticky top-0 z-10 bg-mustard-100">
          <Header tabs={tabs} title={title} onClose={onClose} />
        </div>
        <div className="flex flex-1 flex-col p-5 pt-8 invite:p-8">
          {children}
        </div>
      </div>
    </aside>
  );
}

/**
 * The panel's top exit — the same X the guest's mobile drawer closes with.
 * The X ends the row of tabs, or of the title in their place, in the tabs'
 * own colours.
 */
function Header({
  tabs,
  title,
  onClose,
}: {
  tabs?: ReactNode;
  title?: string;
  onClose: () => void;
}) {
  const t = useTranslations("HostEditor");

  return (
    /*
     * One line under the tabs (or the title) and the X alike, and a divider
     * between the two: the X closes the panel, it is not a fourth tab. The
     * title is as tall as a tab, so the row keeps its height either way.
     */
    <header className="mx-3 flex shrink-0 items-center border-b border-neutral-700 pt-3 font-sans">
      {tabs ?? (
        <h2 className="flex h-10 flex-1 items-center px-2 text-[14px] font-semibold text-neutral-800">
          {title}
        </h2>
      )}
      <span
        aria-hidden="true"
        className="mx-1.5 h-6 w-px shrink-0 bg-neutral-900/25"
      />
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="grid size-8 shrink-0 place-items-center rounded-xs text-neutral-800 transition-colors hover:bg-neutral-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-steel-500"
      >
        <XIcon size={14} />
      </button>
    </header>
  );
}

/**
 * View is the same exit as the header's X. Only below the breakpoint: above
 * it the panel sits beside the card or paper and the top bar's View (or the
 * X) is the way out.
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
    <div className="flex gap-3 invite:hidden">
      <button
        type="button"
        onClick={onClose}
        className={`${BAR_SOLID} flex-1 mb-6 ${className}`}
      >
        {t("view")}
      </button>
    </div>
  );
}
