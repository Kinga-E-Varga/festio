"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { text } from "@/modular/content";
import { BODY, HEADING, OUTLINE_LINK, PAD } from "@/modular/styles";
import type { VariantProps } from "@/types/modular";

const COPIED_MS = 2000;

/** One way to give, laid out to copy without mistakes. */
export function Variant({ values }: VariantProps) {
  const t = useTranslations("Sections");
  const iban = text(values, "iban");

  return (
    <div
      className={`flex flex-col items-center gap-[18px] bg-[var(--m1)] text-center ${PAD}`}
    >
      <h2
        className={`${HEADING} text-[28px] text-[color:var(--m8)] @3xl:text-[34px]`}
      >
        {text(values, "heading")}
      </h2>
      <p className={`${BODY} max-w-[560px]`}>{text(values, "body")}</p>
      <dl className="mt-2 flex w-full max-w-[620px] flex-col border-1 border-[var(--m6)] bg-[var(--m2)] text-left">
        <Row label={t("account")}>{text(values, "holder")}</Row>
        <Row label={t("iban")}>
          <span className="min-w-0 tracking-[0.04em] break-all tabular-nums">
            {iban}
          </span>
          <CopyButton value={iban} />
        </Row>
        <Row label={t("reference")} last>
          {text(values, "reference")}
        </Row>
      </dl>
    </div>
  );
}

function Row({
  label,
  last,
  children,
}: {
  label: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-1 px-6 py-4 @3xl:flex-row @3xl:items-center @3xl:gap-5 ${last ? "" : "border-b-1 border-[var(--m5)]"}`}
    >
      <dt className="w-[120px] shrink-0 text-[12px] tracking-[0.16em] uppercase text-[color:var(--m10)]">
        {label}
      </dt>
      <dd className="flex min-w-0 flex-1 items-center justify-between gap-3 text-[16px] text-[color:var(--m8)]">
        {children}
      </dd>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
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
    <button type="button" onClick={copy} className={OUTLINE_LINK}>
      {copied ? t("copied") : t("copy")}
    </button>
  );
}
