"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { OUTLINE_BUTTON } from "@/modular/styles";

const COPIED_MS = 2000;

/** Copies an IBAN without its spaces; says so for two seconds. */
export function CopyButton({ value }: { value: string }) {
  const t = useTranslations("Sections");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ""));
      setCopied(true);
    } catch {
      /* A browser that refuses the clipboard leaves the IBAN to select by hand. */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`${OUTLINE_BUTTON} self-start`}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
