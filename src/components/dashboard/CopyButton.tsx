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
        className="text-neutral-700 transition-colors hover:text-forest-500"
      >
        <Icon name="copy" className="size-3.5" />
      </button>
      <span
        role="status"
        className={`pointer-events-none absolute -top-7 right-0 bg-forest-600 px-2.5 py-1 text-[10px] whitespace-nowrap text-neutral-50 transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
