import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { XIcon } from "./icons";
import { PANEL, PANEL_CLOSE, PANEL_TABS, VIEW } from "./styles";

interface SidePanelProps {
  /** `edit` for the invitation editor, `sheet-form` for the print page — see `globals.css`. */
  panelClassName: string;
  open: boolean;
  /** The invitation editor takes the reply panel out of the tab order while closed; the print page has nothing behind it to protect. */
  inert?: boolean;
  style?: CSSProperties;
  /** Tabs across the header, beside the X. The print page has none. */
  tabs?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The host's slide-in form: an aside sized and animated by `panelClassName`,
 * the header's close `X`, and the caller's own fields. Shared by the
 * invitation editor and the print page, which take the same shell and differ
 * only in which fields fill it.
 */
export function SidePanel({
  panelClassName,
  open,
  inert,
  style,
  tabs,
  onClose,
  children,
}: SidePanelProps) {
  return (
    // A glow in the panel's own colour, so its edge doesn't cut hard
    // against what's beside it.
    <aside
      style={style}
      className={`${panelClassName} ${PANEL} elevation-panel`}
      data-open={open}
      inert={inert}
    >
      {/*
       * With tabs, the header runs edge to edge below the breakpoint, like
       * the host bar. Above it, it takes a padding of its own — 12px at the
       * sides, 24px above and below. It sticks to the top as the fields
       * scroll under it, on the panel's own surface so they don't show
       * through. The fields keep their full padding under it,
       * 32px on top where the header has none of its own. Without tabs,
       * the X sits inside the padding with the fields.
       */}
      <div className="bg-[var(--c1)] flex flex-1 flex-col overflow-y-auto transition-colors">
        {tabs ? (
          <>
            <div className="sticky top-0 z-10 bg-[var(--c1)] invite:px-3 invite:py-6">
              <Header tabs={tabs} onClose={onClose} />
            </div>
            <div className="flex flex-1 flex-col p-5 pt-8 invite:p-8">
              {children}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col p-5 invite:p-8">
            <Header onClose={onClose} />
            {children}
          </div>
        )}
      </div>
    </aside>
  );
}

/**
 * The panel's top exit — the same X the guest's mobile drawer closes with.
 * Given tabs, the X becomes the last segment of their row, divider and all.
 */
function Header({ tabs, onClose }: { tabs?: ReactNode; onClose: () => void }) {
  const t = useTranslations("HostEditor");

  if (tabs) {
    return (
      <header className={PANEL_TABS}>
        {tabs}
        <button
          type="button"
          aria-label={t("close")}
          onClick={onClose}
          className={PANEL_CLOSE}
        >
          <XIcon size={14} />
        </button>
      </header>
    );
  }

  return (
    <header className="mb-6 flex items-center justify-end gap-4">
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="text-[color:var(--c3)] transition-opacity hover:opacity-60"
      >
        <XIcon size={20} />
      </button>
    </header>
  );
}

/**
 * View is the same exit as the header's X. Only below the breakpoint: above
 * it the panel sits beside the card or paper and the host bar's Edit segment
 * (or the X alone) is the way out.
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
        className={`${VIEW} flex-1 mb-6 ${className}`}
      >
        {t("view")}
      </button>
    </div>
  );
}
