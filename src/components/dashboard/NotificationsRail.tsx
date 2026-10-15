import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { formatRelative } from "@/lib/event";
import { TAG } from "@/components/dashboard/guest-list/styles";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { NOTICES, useNoticeValues } from "@/components/dashboard/notices";
import {
  DANGER_DARK,
  SIDE_CARD_TITLE,
  STRONG_TEXT,
  SUCCESS_DARK,
  TEXT_LINK,
} from "@/components/dashboard/styles";
import { RECENT_RSVPS } from "@/mock/dashboard";

/** As much room under the title as above it. */
const PANEL_LABEL = `mb-4 min-[1800px]:mb-[22px] ${SIDE_CARD_TITLE}`;

/** A notice's call to action and its report link read as one pair. */
const ACTION = `text-[11.5px] min-[1800px]:text-[12.5px] ${TEXT_LINK}`;

/**
 * A card each once the rail docks; in the drawer, one line between them.
 * Docked, the two cards share the column's height: each keeps its own size
 * until together they would overflow, then both shrink and scroll their list
 * under a fixed title. The list is pulled 16px into the card's padding so its
 * scrollbar sits near the edge instead of against the text.
 */
function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="max-rail:py-5 max-rail:first:pt-0 max-rail:last:pb-0 rail:side-card rail:flex rail:min-h-0 rail:flex-col rail:px-4 rail:py-5 min-[1800px]:px-6 min-[1800px]:py-7">
      <h2 className={PANEL_LABEL}>{label}</h2>
      <div className="rail:-mr-4 rail:min-h-0 rail:overflow-y-auto rail:pr-4 rail:side-scroll">
        {children}
      </div>
    </section>
  );
}

export function NotificationsRail() {
  const t = useTranslations("Rail");
  const tNotices = useTranslations("Notices");
  /*
   * Titles are the cards' to-dos, word for word, so the rail reads as their
   * index; bodies are the event editor's banners.
   */
  const tBanner = useTranslations("EventPage");
  const tEvent = useTranslations("Event");
  const tActivity = useTranslations("Activity");
  const locale = useLocale();
  const noticeValues = useNoticeValues();

  return (
    <div className="flex flex-col max-rail:divide-y max-rail:divide-neutral-400 rail:h-full rail:gap-5">
      <Panel label={t("needsAttention")}>
        <ul>
          {NOTICES.map((notice) => {
            const values = noticeValues(notice);
            const contextKey = `${notice.key}.context`;

            return (
              <li
                key={notice.id}
                className="border-t border-neutral-400 py-3 first:border-t-0 first:pt-0 last:pb-0 min-[1800px]:py-3.5"
              >
                <p className="mb-1 text-[13.5px] font-semibold text-neutral-950 min-[1800px]:mb-1.5 min-[1800px]:text-[14px]">
                  {tNotices(`${notice.key}.task`, values)}
                  {tNotices.has(contextKey) ? (
                    <span className="font-normal text-neutral-700">
                      {" "}
                      {tNotices(contextKey, values)}
                    </span>
                  ) : null}
                </p>
                <p className="mb-1 text-[11.5px] leading-[1.45] text-neutral-900 min-[1800px]:mb-1.5 min-[1800px]:text-[12.5px]">
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
      </Panel>

      <Panel label={t("recentRsvps")}>
        <ul>
          {RECENT_RSVPS.map((entry) => (
            <li
              key={entry.id}
              className="flex gap-2.5 border-t border-neutral-400 py-2.5 first:border-t-0 first:pt-0 last:pb-0 min-[1800px]:gap-[11px] min-[1800px]:py-3"
            >
              <span
                aria-hidden="true"
                className={`grid size-6 shrink-0 place-items-center min-[1800px]:size-7 rounded-full border text-[10px] font-semibold ${
                  entry.tag ? DANGER_DARK : SUCCESS_DARK
                }`}
              >
                {entry.initials}
              </span>
              <div className="min-w-0 text-[11.5px] leading-[1.45] text-neutral-900 min-[1800px]:text-[12.5px]">
                <p>
                  {/* The sentence places the names; which word comes first is the language's business. */}
                  {tActivity.rich(entry.action.key, {
                    ...entry.action.values,
                    actor: entry.actor ?? "",
                    b: (chunks) => (
                      <span className={STRONG_TEXT}>{chunks}</span>
                    ),
                  })}
                  {entry.tag ? (
                    <>
                      {" "}
                      <span
                        className={`${TAG} ${DANGER_DARK} inline-block align-[1px]`}
                      >
                        {t("unknownTag")}
                      </span>
                    </>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-700 min-[1800px]:text-[11.5px]">
                  {[
                    entry.event,
                    ...(entry.details?.length
                      ? [
                          entry.details
                            .map((detail) =>
                              tActivity(detail.key, detail.values),
                            )
                            .join(", "),
                        ]
                      : []),
                    formatRelative(entry.when, locale),
                  ].join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
