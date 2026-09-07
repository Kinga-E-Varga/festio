"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";

interface CopyButtonProps {
  value: string;
  /** Describes what gets copied, e.g. "Copy invitation link". */
  label: string;
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="grid size-6 place-items-center rounded transition-colors hover:bg-cream-200"
      >
        <Icon name="copy" className="size-3.5 text-stone-500" />
      </button>
      <span
        role="status"
        className={`pointer-events-none absolute -top-6 right-0 rounded bg-ink-900 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-cream-50 transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
