"use client";

import { useEffect } from "react";

/**
 * While `active`, leaving the page asks first: the browser's own prompt on
 * reload or close, and a confirm on an in-app link or a control marked
 * `data-leaves` (BACK). Declined, the click never reaches the router.
 */
export function useLeaveWarning(active: boolean, message: string) {
  useEffect(() => {
    if (!active) return;
    function unload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }
    /* Capture on the document runs before React's own listener on the root. */
    function click(event: MouseEvent) {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target instanceof Element ? event.target : null;
      const leaving = target?.closest(
        "a[href]:not([target=_blank]), [data-leaves]",
      );
      if (!leaving || window.confirm(message)) return;
      event.preventDefault();
      event.stopPropagation();
    }
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
    };
  }, [active, message]);
}
