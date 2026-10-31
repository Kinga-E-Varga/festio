"use client";

import { useEffect, useRef } from "react";

/**
 * A ref for the cover's root: `data-paused` on it while it is out of view,
 * set on the element itself, so scrolling never re-renders the cover.
 */
export function useOutOfView<T extends HTMLElement>() {
  const cover = useRef<T>(null);
  useEffect(() => {
    const element = cover.current;
    if (!element) return;
    const watch = new IntersectionObserver(([entry]) =>
      element.toggleAttribute("data-paused", !entry.isIntersecting),
    );
    watch.observe(element);
    return () => watch.disconnect();
  }, []);
  return cover;
}
