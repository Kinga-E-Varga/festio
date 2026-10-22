import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { STRIP_ICON, BAR_ICON } from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import { EDITOR_PANEL_ID } from "./EditorFrame";
import { PANEL } from "./styles";

interface SidePanelProps {
  /** `edit` for the invitation editor, `sheet-form` for the print page — see `globals.css`. */
  panelClassName: string;
  open: boolean;
  /** The invitation editor takes the reply panel out of the tab order while closed; the print page has nothing behind it to protect. */
  inert?: boolean;
  /** The open view's name, on top beside the X: the tab, or Print settings. */
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The host's slide-in form: an aside sized and animated by `panelClassName`,
 * opened from the editor's strip (`EditorFrame`), with the open view's title
 * and an X on top, then the caller's own fields. Shared by the invitation
 * editors and the print page, which take the same shell and differ only in
 * which fields fill it. Laid out like the dashboard's side panel.
 *
 * Festio's own chrome, never the invitation's palette: the dashboard's page
 * fill and the layout's edge, in the app's face and ink. No shadow: the
 * edge line alone sets it apart from the page.
 */
export function SidePanel({
  panelClassName,
  open,
  inert,
  title,
  onClose,
  children,
}: SidePanelProps) {
  const t = useTranslations("HostEditor");

  /*
   * The X sits inside the panel, which goes inert as it closes, so focus goes
   * back to the strip's button that opened it.
   */
  function closeToOpener() {
    const opener = document.querySelector<HTMLElement>(
      `[aria-controls="${EDITOR_PANEL_ID}"][aria-expanded="true"]`,
    );
    onClose();
    opener?.focus();
  }

  return (
    <aside
      id={EDITOR_PANEL_ID}
      aria-label={title}
      className={`${panelClassName} ${PANEL} border-l border-neutral-300 bg-neutral-125 font-sans text-neutral-950`}
      data-open={open}
      inert={inert}
    >
      <div
        data-panel-scroll
        className="side-scroll flex flex-1 flex-col overflow-y-auto [--scroll-track:var(--color-neutral-125)]"
      >
        {/*
         * The dashboard side panel's spacing: its title row level with the
         * strip's first button, then the content's top gap, taken into the
         * header here because it sticks to the top as the fields scroll under
         * it, on the panel's own surface so they don't show through.
         */}
        <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-3 bg-neutral-125 pt-chrome-top pr-2.5 pb-chrome-top pl-[18px]">
          <h2 className="card-title">{title}</h2>
          <button
            type="button"
            onClick={closeToOpener}
            aria-label={t("close")}
            className={BAR_ICON}
          >
            <Icon name="close" {...STRIP_ICON} />
          </button>
        </header>
        <div className="flex flex-1 flex-col px-[18px] pb-5">{children}</div>
      </div>
    </aside>
  );
}
