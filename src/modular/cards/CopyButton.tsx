"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { OUTLINE_BUTTON } from "@/modular/styles";

const COPIED_MS = 2000;

/**
 * Copies an IBAN without its spaces; says so for two seconds. An outline
 * button in the accent, at the start of its column, unless `className`
 * says otherwise.
 */
export function CopyButton({
  value,
  className = `${OUTLINE_BUTTON} self-start`,
}: {
  value: string;
  className?: string;
}) {
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
      className={`${className} cursor-pointer`}
    >
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
