import type { ReactNode } from "react";
import { BOX_ROW } from "@/components/dashboard/styles";

interface SettingRowProps {
  title: ReactNode;
  children?: ReactNode;
  /** Its button, on the right; a row without one only explains. */
  action?: ReactNode;
  /** Closer to the rows around it, for a box of short rows. */
  tight?: boolean;
}

/**
 * One line in a settings band: what it is, a sentence under it, and its
 * button on the right (under it on a narrow column). Rows that follow one
 * another are ruled apart.
 */
export function SettingRow({
  title,
  children,
  action,
  tight = false,
}: SettingRowProps) {
  return (
    <div
      className={`${BOX_ROW} flex flex-col gap-3 ${tight ? "pt-3" : "pt-5"} first:pt-0 @min-[520px]:flex-row @min-[520px]:items-center @min-[520px]:gap-5`}
    >
      <div className="min-w-0 flex-1">
        <b className="block item-title leading-[1.5]">{title}</b>
        {children ? <p className="mt-0.5 hint-text">{children}</p> : null}
      </div>
      {action}
    </div>
  );
}
