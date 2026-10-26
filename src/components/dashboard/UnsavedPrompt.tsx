"use client";

import { useEffect, useRef } from "react";
import { AlertRow } from "@/components/dashboard/AlertRow";
import {
  ALERT,
  SMALL_BTN_WARN,
  SMALL_BTN_WARN_SOLID,
} from "@/components/dashboard/styles";

interface UnsavedPromptProps {
  title: string;
  discardLabel: string;
  keepLabel: string;
  onDiscard: () => void;
  onKeep: () => void;
  /** Counts the clicks that asked again; each one brings the prompt back into view. */
  asked?: number;
  className?: string;
}

/**
 * The warning bar for unsaved changes, in the editor that holds them: the
 * guest list's row editors and Add names box, an Event settings card. The
 * click that raised it may be far away, so it comes into view and onto
 * Keep editing.
 */
export function UnsavedPrompt({
  title,
  discardLabel,
  keepLabel,
  onDiscard,
  onKeep,
  asked,
  className = "",
}: UnsavedPromptProps) {
  const prompt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    prompt.current?.scrollIntoView({ block: "nearest" });
    /* Onto Keep editing, the safe one, so a stray Enter loses nothing. */
    prompt.current
      ?.querySelector<HTMLButtonElement>("button:last-of-type")
      ?.focus();
  }, [asked]);

  return (
    <div
      ref={prompt}
      role="alert"
      className={`${className} ${ALERT} @container scroll-mt-[88px] scroll-mb-4`}
    >
      <AlertRow title={title}>
        <button type="button" onClick={onDiscard} className={SMALL_BTN_WARN}>
          {discardLabel}
        </button>
        <button type="button" onClick={onKeep} className={SMALL_BTN_WARN_SOLID}>
          {keepLabel}
        </button>
      </AlertRow>
    </div>
  );
}
