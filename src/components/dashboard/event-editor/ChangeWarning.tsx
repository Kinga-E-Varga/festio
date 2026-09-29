"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { Icon } from "@/components/icons";
import type { Warning } from "@/components/dashboard/event-editor/useEventForm";

interface ChangeWarningProps {
  title: string;
  children: ReactNode;
  warning: Warning;
}

/**
 * A change guests would notice. Festio tells nobody, so the save stays locked
 * until the host has ticked the box saying they will.
 */
export function ChangeWarning({
  title,
  children,
  warning,
}: ChangeWarningProps) {
  const t = useTranslations("EventEditor");
  if (!warning.shown) return null;

  return (
    <Banner tone="warn" icon="alert" title={title}>
      {children}

      <label className="mt-[11px] flex cursor-pointer items-start gap-[9px] border-t border-terracotta-400 pt-2.5 font-semibold">
        <span className="relative mt-px grid size-4 shrink-0 place-items-center">
          <input
            type="checkbox"
            checked={warning.acknowledged}
            onChange={(control) => warning.toggle(control.target.checked)}
            className="peer size-4 cursor-pointer appearance-none rounded-[3px] border-[1.5px] border-terracotta-600 bg-mustard-50 checked:bg-terracotta-600"
          />
          <Icon
            name="check"
            className="pointer-events-none absolute size-3 text-mustard-50 opacity-0 peer-checked:opacity-100"
          />
        </span>
        {t("acknowledge")}
      </label>
    </Banner>
  );
}
