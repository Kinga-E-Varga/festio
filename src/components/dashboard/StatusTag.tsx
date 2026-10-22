import { useTranslations } from "next-intl";
import { TAG } from "@/components/dashboard/guest-list/styles";
import { SUCCESS_DARK, WARNING_DARK } from "@/components/dashboard/styles";
import type { EventStatus } from "@/types/dashboard";

/** Each status's colours: live, still a draft, or over. */
const TONE: Record<EventStatus, string> = {
  active: SUCCESS_DARK,
  draft: WARNING_DARK,
  past: "border-neutral-400 bg-neutral-200 text-neutral-700",
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
