"use client";

import { useCallback, useEffect, useState } from "react";

const VISIBLE_MS = 2400;

/** One transient message at a time, cleared on its own. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const show = useCallback((next: string) => setMessage(next), []);

  return { message, show };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2 bg-forest-600 px-5 py-[11px] text-[13px] text-neutral-50 transition-opacity duration-200 ${
        message ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
