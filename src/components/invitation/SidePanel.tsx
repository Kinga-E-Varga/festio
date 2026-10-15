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
 * Festio's own chrome, never the invitation's palette: the dashboard's page
 * fill and the event cards' edge, in the app's face and ink. No shadow: the
 * edge line alone sets it apart from the page.
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
      className={`${panelClassName} ${PANEL} border-l border-neutral-400 bg-neutral-100 font-sans text-neutral-950`}
      data-open={open}
      inert={inert}
    >
      {/*
       * With tabs, the header runs edge to edge and sticks to the top as the
       * fields scroll under it, on the panel's own surface so they don't
       * show through. Without (the print page) the form starts at the top
       * and the X sits in the corner, where the header would put it, and
       * scrolls away with the form: View at its foot closes it too.
       */}
      <div data-panel-scroll className="flex flex-1 flex-col overflow-y-auto">
        {tabs ? (
          /*
           * The gap under the tabs belongs to the sticky header, so a long
           * form scrolls out of sight a gap below the tabs rather than right
           * against them.
           */
          <div className="sticky top-0 z-10 bg-neutral-100">
            <Header tabs={tabs} onClose={onClose} />
          </div>
        ) : (
          <div className="relative z-10 flex h-0 justify-end">
            <CloseButton onClose={onClose} className="mt-2.5 mr-3" />
          </div>
        )}
        <div
          className={`flex flex-1 flex-col p-5 invite:p-8 ${tabs ? "pt-0 invite:pt-0" : ""}`}
        >
          {children}
        </div>
      </div>
    </aside>
  );
}

/** The row of tabs, ended by the X a small gap after them. */
function Header({ tabs, onClose }: { tabs: ReactNode; onClose: () => void }) {
  return (
    <header className="mx-3 flex shrink-0 items-center gap-1 pt-2.5 pb-7.5 font-sans">
      {tabs}
      <CloseButton onClose={onClose} />
    </header>
  );
}

/**
 * The X, there only below the breakpoint, where the panel covers the
 * viewport; beside the card or paper the top bar's View closes it.
 */
function CloseButton({
  onClose,
  className = "",
}: {
  onClose: () => void;
  className?: string;
}) {
  const t = useTranslations("HostEditor");

  return (
    <button
      type="button"
      aria-label={t("close")}
      onClick={onClose}
      className={`grid size-btn shrink-0 place-items-center rounded-ui bg-primary-900 text-secondary-100 transition-colors hover:bg-primary-800 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-info-600 invite:hidden ${className}`}
    >
      <XIcon size={14} />
    </button>
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
        className={`${BAR_SOLID} flex-1 mb-6 ${className}`}
      >
        {t("view")}
      </button>
    </div>
  );
}
