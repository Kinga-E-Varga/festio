import type { ReactNode } from "react";
import { Icon } from "@/components/icons";
import { BANNER_TITLE, WARNING_SOFT } from "@/components/dashboard/styles";
import type { IconName } from "@/types/dashboard";

interface BannerProps {
  icon: IconName;
  title: string;
  children: ReactNode;
  /** Sits under the text, below the icon's row. */
  footer?: ReactNode;
  /** Its space above, 12px unless the place it sits says otherwise. */
  className?: string;
}

/** A warning in its own box: the icon in the words' colour, a title, then the text. */
export function Banner({
  icon,
  title,
  children,
  footer,
  className = "mt-3",
}: BannerProps) {
  return (
    <div
      className={`${className} grid grid-cols-[auto_1fr] items-start gap-x-3 rounded-ui border px-[15px] py-2.5 meta-face leading-[1.5] ${WARNING_SOFT}`}
    >
      <Icon
        name={icon}
        strokeWidth={2}
        className="mt-[1.5px] size-4 shrink-0"
      />
      <div>
        <b className={BANNER_TITLE}>{title}</b>
        {children}
      </div>
      {footer ? <div className="col-start-2">{footer}</div> : null}
    </div>
  );
}
