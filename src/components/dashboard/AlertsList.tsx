import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { useNoticeValues } from "@/components/dashboard/notices";
import type { AttentionNotice } from "@/types/dashboard";
import { BOX_ROW, TEXT_LINK } from "@/components/dashboard/styles";

/** A notice's call to action and its report link read as one pair. */
const ACTION = `panel-face ${TEXT_LINK}`;

/** The side panel's alerts: what needs the host, behind the bell. */
export function AlertsList({ notices }: { notices: AttentionNotice[] }) {
  const tNotices = useTranslations("Notices");
  /*
   * Titles are the cards' to-dos, word for word, so the alerts read as their
   * index; bodies are the event editor's banners.
   */
  const tBanner = useTranslations("EventPage");
  const tEvent = useTranslations("Event");
  const noticeValues = useNoticeValues();

  return (
    <ul>
      {notices.map((notice) => {
        const values = noticeValues(notice);
        return (
          <li
            key={notice.id}
            className={`${BOX_ROW} py-3 first:pt-0 last:pb-0 wide:py-3.5`}
          >
            <p className="mb-1 panel-face strong-text leading-[1.45] wide:mb-1.5">
              {tNotices(`${notice.key}.task`, values)}
              <span className="font-normal text-neutral-700">
                {" "}
                {tNotices("context", values)}
              </span>
            </p>
            <p className="mb-1 panel-text leading-[1.45] wide:mb-1.5">
              {tBanner(`${notice.key}Body`, values)}
            </p>
            <NoticeAction notice={notice} className={ACTION}>
              {tNotices(`${notice.key}.action`, values)}
            </NoticeAction>
            {notice.reportHref ? (
              <Link href={notice.reportHref} className={`ml-4 ${ACTION}`}>
                {tEvent("reportFlood")}
              </Link>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
