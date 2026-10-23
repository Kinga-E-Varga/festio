import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { BANNER_ICON } from "@/components/dashboard/event-editor/styles";
import {
  BANNER_TITLE,
  BANNER_TONE,
  type BannerTone,
} from "@/components/dashboard/styles";
import type { IconName } from "@/types/dashboard";

interface BannerProps {
  tone: BannerTone;
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Sits under the text, below the icon's row. */
  footer?: ReactNode;
  /** Its space above, 12px unless the place it sits says otherwise. */
  className?: string;
}

export function Banner({
  tone,
  icon,
  title,
  children,
  footer,
  className = "mt-3",
}: BannerProps) {
  return (
    <div
      className={`${className} grid grid-cols-[auto_1fr] items-start gap-x-3 rounded-ui border px-[15px] py-2.5 meta-face leading-[1.5] ${BANNER_TONE[tone]}`}
    >
      <Icon
        name={icon}
        strokeWidth={2}
        className={`mt-[1.5px] size-4 shrink-0 ${BANNER_ICON[tone]}`}
      />
      <div>
        <b className={BANNER_TITLE}>{title}</b>
        {children}
      </div>
      {footer ? <div className="col-start-2">{footer}</div> : null}
    </div>
  );
}
