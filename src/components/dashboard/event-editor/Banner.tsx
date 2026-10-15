import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import {
  BANNER_ICON,
  BANNER_TITLE,
  BANNER_TONE,
  type BannerTone,
  ICON_SQUARE,
} from "@/components/dashboard/event-editor/styles";
import type { IconName } from "@/types/dashboard";

interface BannerProps {
  tone: BannerTone;
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Sits under the text, below the icon's row, so the icon centres on the text alone. */
  footer?: ReactNode;
}

export function Banner({ tone, icon, title, children, footer }: BannerProps) {
  return (
    <div
      className={`mt-3 grid grid-cols-[auto_1fr] items-center gap-x-3.5 rounded-ui border px-[15px] py-2.5 text-[12.5px] leading-[1.5] ${BANNER_TONE[tone]}`}
    >
      <span className={`${ICON_SQUARE} ${BANNER_ICON[tone]}`}>
        <Icon name={icon} className="size-[17px]" strokeWidth={1.75} />
      </span>
      <div>
        <b className={BANNER_TITLE}>{title}</b>
        {children}
      </div>
      {footer ? <div className="col-start-2">{footer}</div> : null}
    </div>
  );
}
