import type { ReactNode } from "react";
import { SOFT_ACTION, HINT } from "@/components/dashboard/event-editor/styles";
import { Icon } from "@/components/icons";
import type { IconName } from "@/types/dashboard";

/** The row's look, without its size: neutral edge, pale fill, type and side padding. */
export const SUMMARY_SURFACE =
  "rounded-ui border border-neutral-400 bg-neutral-50 pr-4 pl-5 font-medium text-neutral-800";
/** The event editor's row: the surface at its full height. */
const SUMMARY_BOX = `${SUMMARY_SURFACE} min-h-[60px] py-3`;

interface SummarySwitchProps {
  icon: IconName;
  /** The setting as one sentence; it always stays beside the icon. */
  text: ReactNode;
  /** What follows the sentence when there's room: a picker, a link. */
  children?: ReactNode;
  /** Switches between the default and the host's own choice. */
  action: string;
  onAction: () => void;
  hint: ReactNode;
}

/**
 * A setting read as one sentence, with one button to leave or return to the
 * default. Narrow: sentence, controls and a full-width button stack. Wider:
 * the button moves to the right. Widest: everything sits in one row.
 */
export function SummarySwitch({
  icon,
  text,
  children,
  action,
  onAction,
  hint,
}: SummarySwitchProps) {
  return (
    <>
      <div
        className={`${SUMMARY_BOX} flex flex-col gap-3 @min-[460px]:flex-row @min-[460px]:items-center @min-[460px]:gap-4`}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-3 @min-[680px]:flex-row @min-[680px]:items-center @min-[680px]:gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Icon
              name={icon}
              className="size-[22px] text-neutral-500"
              strokeWidth={1.75}
            />
            <span className="min-w-0">{text}</span>
          </div>
          {children}
        </div>
        <button
          type="button"
          onClick={onAction}
          className={`w-full shrink-0 @min-[460px]:w-auto @min-[460px]:min-w-[145px] ${SOFT_ACTION}`}
        >
          {action}
        </button>
      </div>
      <div className={`mt-1.5 ${HINT}`}>{hint}</div>
    </>
  );
}
