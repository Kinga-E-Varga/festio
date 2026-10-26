"use client";

import { useState, useSyncExternalStore } from "react";

/**
 * `--breakpoint-invite` written out: from here the panel sits beside the
 * invitation; below it, it covers the screen.
 */
export const PANEL_BESIDE = "(min-width: 1000px)";

function onWidth(change: () => void) {
  const query = window.matchMedia(PANEL_BESIDE);
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
}

/**
 * Whether an invitation editor's panel is open. Until the host opens or
 * shuts it, it is open where it sits beside the invitation and shut where
 * it would cover the screen, so there the host sees the invitation first.
 * Shut on the server, as the width is only known in the browser.
 */
export function useEditing() {
  const [choice, setChoice] = useState<boolean | null>(null);
  const beside = useSyncExternalStore(
    onWidth,
    () => window.matchMedia(PANEL_BESIDE).matches,
    () => false,
  );
  return [choice ?? beside, setChoice] as const;
}
