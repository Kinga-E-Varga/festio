"use client";

import { useEffect, useRef } from "react";
import {
  SMALL_BTN_DISCARD,
  SMALL_BTN_KEEP,
} from "@/components/dashboard/guest-list/styles";
import { WARNING_DARK } from "@/components/dashboard/styles";

/** The warning fill without the edge the other alerts have, so it asks rather than alarms. */
const PROMPT = `rounded-ui px-4 py-3 meta-face ${WARNING_DARK}`;

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
      className={`${className} ${PROMPT} flex scroll-mt-[88px] scroll-mb-4 flex-wrap items-center gap-2.5`}
    >
      <span className="mr-auto">{title}</span>
      <div className="flex shrink-0 items-center gap-2.5">
        <button type="button" onClick={onDiscard} className={SMALL_BTN_DISCARD}>
          {discardLabel}
        </button>
        <button type="button" onClick={onKeep} className={SMALL_BTN_KEEP}>
          {keepLabel}
        </button>
      </div>
    </div>
  );
}
