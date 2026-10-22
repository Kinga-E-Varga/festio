"use client";

import { useState } from "react";

/** What the right-hand panel can show, one at a time, each behind its own icon. */
export type SidePanelView = "cart" | "alerts" | "replies" | "account";

export interface SidePanel {
  /** The view shown, kept while the panel closes so it slides away with it. */
  view: SidePanelView;
  open: boolean;
  /** The active view's icon: closes the panel. Any other icon: shows that view. */
  select: (view: SidePanelView) => void;
  close: () => void;
}

/**
 * The right-hand panel works like a page beside the page: an icon opens it on
 * its view, another icon swaps the content in place, and only the active icon
 * or the panel's own X closes it — never a click elsewhere.
 */
export function useSidePanel(): SidePanel {
  const [view, setView] = useState<SidePanelView>("alerts");
  const [open, setOpen] = useState(false);

  function select(next: SidePanelView) {
    if (open && next === view) {
      setOpen(false);
      return;
    }
    setView(next);
    setOpen(true);
  }

  return { view, open, select, close: () => setOpen(false) };
}
