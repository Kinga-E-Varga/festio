import { useTranslations } from "next-intl";
import { BoxHead } from "@/components/dashboard/BoxHead";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { useNoticeValues } from "@/components/dashboard/notices";
import { RowLines } from "@/components/dashboard/RowLines";
import {
  BOX_ROWS,
  PAGE_BOX,
  TEXT_LINK_SHAPE,
} from "@/components/dashboard/styles";
import type {
  AttentionNotice,
  DashboardEvent,
  NoticeTone,
} from "@/types/dashboard";

/**
 * Each notice's mark, and its link in the mark's colour: brick for the ones
 * that stop replies, amber for the rest. The links are a step darker, to read well.
 */
const DANGER = {
  mark: "bg-danger-600",
  link: "text-danger-700 hover:text-danger-800",
};
const WARNING = {
  mark: "bg-warning-400",
  link: "text-warning-700 hover:text-warning-800",
};
const TONE: Record<NoticeTone, { mark: string; link: string }> = {
  attention: DANGER,
  paused: DANGER,
  deadline: WARNING,
  deletion: WARNING,
  hidden: WARNING,
};

/**
 * Every event's alerts, most urgent first, as the bell lists them: the
 * event, the task, the way to deal with it. A planner can have many, so the
 * list scrolls inside the box after about three.
 */
export function AttentionCard({
  notices,
  events,
  className = "",
}: {
  notices: AttentionNotice[];
  /** Where each notice's event title is looked up. */
  events: DashboardEvent[];
  className?: string;
}) {
  const t = useTranslations("Dashboard");
  const tNotices = useTranslations("Notices");
  const noticeValues = useNoticeValues();

  return (
    <section className={`${PAGE_BOX} ${className}`}>
      <BoxHead title={t("attention")} count={notices.length} />
      {notices.length === 0 ? (
        <p className="muted-text">{t("allCaughtUp")}</p>
      ) : (
        <ul
          className={`${BOX_ROWS} side-scroll -mr-2 max-h-[264px] overflow-y-auto pr-2 [--scroll-track:var(--color-neutral-50)]`}
        >
          {notices.map((notice) => {
            const values = noticeValues(notice);
            const title =
              events.find((event) => event.id === notice.eventId)?.title ?? "";

            return (
              <li
                key={notice.id}
                className="flex gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden="true"
                  className={`w-[3px] shrink-0 rounded-full ${TONE[notice.tone].mark}`}
                />
                <RowLines
                  title={title}
                  detail={tNotices(`${notice.key}.task`, values)}
                >
                  <NoticeAction
                    notice={notice}
                    className={`mt-1 self-start text-left meta-face ${TEXT_LINK_SHAPE} ${TONE[notice.tone].link}`}
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
