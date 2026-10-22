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
    /* With its row's 6px gap, as far from the hint above as from the rule below. */
    <Banner
      className="mt-1.5"
      tone="warn"
      icon="alert"
      title={title}
      footer={
        <label className="mt-[11px] flex cursor-pointer items-start gap-[9px] border-t border-current/50 pt-2.5 font-semibold">
          <span className="relative mt-px grid size-4 shrink-0 place-items-center">
            <input
              type="checkbox"
              checked={warning.acknowledged}
              onChange={(control) => warning.toggle(control.target.checked)}
              className="peer size-4 cursor-pointer appearance-none rounded-ui border-[1.5px] border-warning-700 bg-secondary-100 checked:bg-warning-700"
            />
            <Icon
              name="check"
              className="pointer-events-none absolute size-3 text-secondary-100 opacity-0 peer-checked:opacity-100"
            />
          </span>
          {t("acknowledge")}
        </label>
      }
    >
      {children}
    </Banner>
  );
}
