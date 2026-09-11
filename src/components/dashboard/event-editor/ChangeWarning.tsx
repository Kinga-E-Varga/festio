"use client";

import type { ReactNode } from "react";
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
  if (!warning.shown) return null;

  return (
    <div className="mt-[18px] flex gap-[11px] border border-terracotta-400 bg-terracotta-200 px-[15px] py-[13px] text-[12.5px] leading-[1.5] text-terracotta-600">
      <Icon name="alert" className="mt-px size-4 shrink-0" />
      <div>
        <b className="mb-[3px] block">{title}</b>
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
          I understand — telling my guests is up to me.
        </label>
      </div>
    </div>
  );
}
