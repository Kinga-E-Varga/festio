import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import {
  BANNER_TONE,
  type BannerTone,
} from "@/components/dashboard/event-editor/styles";
import type { IconName } from "@/types/dashboard";

interface BannerProps {
  tone: BannerTone;
  icon: IconName;
  title: string;
  children: ReactNode;
}

export function Banner({ tone, icon, title, children }: BannerProps) {
  return (
    <div
      className={`mt-[18px] flex gap-[11px] border px-[15px] py-[13px] text-[12.5px] leading-[1.5] ${BANNER_TONE[tone]}`}
    >
      <Icon name={icon} className="mt-px size-4 shrink-0" />
      <div>
        <b className="mb-[3px] block font-semibold">{title}</b>
        {children}
      </div>
    </div>
  );
}
