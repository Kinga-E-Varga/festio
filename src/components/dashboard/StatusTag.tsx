import { useTranslations } from "next-intl";
import {
  NEUTRAL_SOFT,
  SUCCESS_SOFT,
  TAG,
  WARNING_SOFT,
} from "@/components/dashboard/styles";
import type { EventStatus } from "@/types/dashboard";

/** Each status's colours, borderless: live, Hidden, or over. */
const TONE: Record<EventStatus, string> = {
  active: SUCCESS_SOFT,
  hidden: WARNING_SOFT,
  past: NEUTRAL_SOFT,
};

/** The Overview's, roomier than the rows' tags beside a box title, its text the same size. */
const TAG_LARGE =
  "rounded-ui border px-2 py-0.5 text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase";

/** An event's Live / Draft / Past tag: Home's rows and the Overview's event box. */
export function StatusTag({
  status,
  large = false,
  className = "",
}: {
  status: EventStatus;
  large?: boolean;
  className?: string;
}) {
  const t = useTranslations("Dashboard");

  return (
    <span className={`${large ? TAG_LARGE : TAG} ${TONE[status]} ${className}`}>
      {t(`status.${status}`)}
    </span>
  );
}
