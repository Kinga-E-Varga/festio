"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Banner } from "@/components/dashboard/event-editor/Banner";
import { Checkbox } from "@/components/dashboard/event-editor/Checkbox";
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
    /* With its row's 6px gap, as far from the hint above as from the rule below. */
    <Banner
      className="mt-1.5"
      icon="alert"
      title={title}
      footer={
        <label className="mt-[11px] flex cursor-pointer items-start gap-[9px] border-t border-warning-600 pt-2.5 font-semibold">
          <Checkbox
            checked={warning.acknowledged}
            onChange={(control) => warning.toggle(control.target.checked)}
            look={{
              box: "border-warning-700 bg-secondary-100 checked:bg-warning-700",
              tick: "text-secondary-100",
            }}
          />
          {t("acknowledge")}
        </label>
      }
    >
      {children}
    </Banner>
  );
}
