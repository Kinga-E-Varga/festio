"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import type { IconName } from "@/types/dashboard";

interface CopyButtonProps {
  value: string;
  /** Describes what gets copied, e.g. "Copy invitation link". */
  label: string;
  /** The icon's colour and hover; the event editor's neutral by default. */
  tone?: string;
  /** The glyph; a copy sign by default. */
  icon?: IconName;
  /** What the tag says once copied; "Copied" by default. */
  copiedLabel?: string;
}

/**
 * The clipboard API exists only on secure pages (https or localhost), so a
 * phone on the dev server's LAN address has none. There, copy the old way:
 * select the text in an off-screen field and ask the browser to copy it.
 */
function copyFallback(value: string): boolean {
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  // 16px, or iOS zooms in on the field when it is selected.
  field.className = "fixed top-0 left-0 text-base opacity-0";
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, value.length);
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}

export function CopyButton({
  value,
  label,
  tone = "text-neutral-700 hover:text-primary-700",
  icon = "copy",
  copiedLabel,
}: CopyButtonProps) {
  const t = useTranslations("Event");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        return;
      }
    } catch {
      // Refused (no permission, page not focused): try the old way below.
    }
    setCopied(copyFallback(value));
  }

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        // The glyph is 16px; the padding, given back by the margin, makes a
        // fingertip-sized target without moving it.
        className={`-m-2 p-2 transition-colors ${tone}`}
      >
        <Icon name={icon} className="size-4" />
      </button>
      <span
        role="status"
        className={`pointer-events-none absolute -top-7 right-0 rounded-ui bg-primary-800 px-2.5 py-1 text-[11.5px] whitespace-nowrap text-neutral-50 transition-opacity ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? (copiedLabel ?? t("copied")) : ""}
      </span>
    </span>
  );
}
