import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { NOTICES, useNoticeValues } from "@/components/dashboard/notices";
import { RowLines } from "@/components/dashboard/RowLines";
import { BOX_ROWS, LINK_TEXT, PAGE_BOX } from "@/components/dashboard/styles";
import { findEvent } from "@/mock/dashboard";
import type { NoticeTone } from "@/types/dashboard";

/** Each notice's mark: brick for the ones that stop replies, gold for the rest. */
const MARK: Record<NoticeTone, string> = {
  attention: "bg-danger-600",
  paused: "bg-danger-600",
  deadline: "bg-warning-400",
  deletion: "bg-warning-400",
  billing: "bg-warning-400",
  hidden: "bg-warning-400",
};

/**
 * Every event's alerts, most urgent first, as the bell lists them: the
 * event, the task, the way to deal with it. A planner can have many, so the
 * list scrolls inside the box after about three.
 */
export function AttentionCard({ className = "" }: { className?: string }) {
  const t = useTranslations("Dashboard");
  const tNotices = useTranslations("Notices");
  const noticeValues = useNoticeValues();

  return (
    <section className={`${PAGE_BOX} ${className}`}>
      <BoxHead title={t("attention")} count={NOTICES.length} />
      {NOTICES.length === 0 ? (
        <p className="muted-text">{t("allCaughtUp")}</p>
      ) : (
        <ul
          className={`${BOX_ROWS} side-scroll -mr-2 max-h-[264px] overflow-y-auto pr-2 [--scroll-track:var(--color-neutral-50)]`}
        >
          {NOTICES.map((notice) => {
            const values = noticeValues(notice);
            const title = findEvent(notice.eventId)?.title ?? "";

            return (
              <li
                key={notice.id}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`w-[3px] shrink-0 rounded-full ${MARK[notice.tone]}`}
                />
                <RowLines
                  title={title}
                  detail={tNotices(`${notice.key}.task`, values)}
                >
                  <NoticeAction
                    notice={notice}
                    className={`mt-1 self-start text-left ${LINK_TEXT}`}
                  >
                    {tNotices(`${notice.key}.action`, values)}
                  </NoticeAction>
                </RowLines>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
