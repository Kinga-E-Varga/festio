import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import type { IconName } from "@/types/dashboard";

/** Frozen states are grey, deadlines amber, explanations teal, notices gold. */
export type BannerTone = "frozen" | "warn" | "info" | "gold";

const TONE: Record<BannerTone, string> = {
  frozen: "border-neutral-500 bg-neutral-300 text-neutral-800",
  warn: "border-terracotta-400 bg-terracotta-200 text-terracotta-600",
  info: "border-steel-400 bg-steel-200 text-steel-600",
  gold: "border-mustard-500 bg-mustard-200 text-mustard-600",
};

interface BannerProps {
  tone: BannerTone;
  icon: IconName;
  title: string;
  children: ReactNode;
}

export function Banner({ tone, icon, title, children }: BannerProps) {
  return (
    <div
      className={`mt-[18px] flex gap-[11px] border px-[15px] py-[13px] text-[12.5px] leading-[1.5] ${TONE[tone]}`}
    >
      <Icon name={icon} className="mt-px size-4 shrink-0" />
      <div>
        <b className="mb-[3px] block">{title}</b>
        {children}
      </div>
    </div>
  );
}
