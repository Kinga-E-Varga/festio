"use client";

import { useCallback, useEffect, useState } from "react";

const VISIBLE_MS = 4000;

export type ToastTone = "success" | "neutral" | "warning" | "error";

const TONE_CLASSES: Record<ToastTone, string> = {
  success: "bg-forest-600 text-neutral-50",
  neutral: "bg-neutral-800 text-neutral-50",
  warning: "bg-mustard-600 text-neutral-50",
  error: "bg-rust-600 text-neutral-50",
};

/** One transient message at a time, cleared on its own. */
export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<ToastTone>("success");

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  const show = useCallback((next: string, nextTone: ToastTone = "success") => {
    setMessage(next);
    setTone(nextTone);
  }, []);

  return { message, tone, show };
}

interface ToastProps {
  message: string | null;
  tone: ToastTone;
}

export function Toast({ message, tone }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-7 left-1/2 z-50 w-max max-w-[80vw] -translate-x-1/2 px-8 py-[18px] text-center text-[14px] font-medium text-balance transition-opacity duration-200 ${TONE_CLASSES[tone]} ${
        message ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
