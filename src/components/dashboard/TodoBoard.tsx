import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { WARNING_SOFT } from "@/components/dashboard/styles";
import { BANNER_TITLE } from "@/components/dashboard/event-editor/styles";
import { useNoticeValues } from "@/components/dashboard/notices";
import { Link } from "@/i18n/navigation";
import type { AttentionNotice, IconName, NoticeTone } from "@/types/dashboard";

/** A task's kind, shown as its small icon. */
const TONE_ICON: Record<NoticeTone, IconName> = {
  attention: "alert",
  paused: "ban",
  deadline: "clock",
  hidden: "eyeOff",
  deletion: "download",
};

/** A to-do: a small warning-tinted box of its own, coloured as the Hidden tag. */
const TODO_ITEM = `rounded-ui ${WARNING_SOFT} transition-colors hover:bg-warning-200`;

/**
 * What an event is waiting on, most urgent first: the alerts for this event,
 * each told as a task with its way to deal with it. The alerts hide behind
 * the bell, so the event's card on the dashboard carries them too.
 *
 * Each task says what to do, then why now, as the alerts drawer words
 * it. Each is its own box, a little apart from the next: the whole box is its
 * action, with its kind's icon and a chevron.
 */
export function TodoBoard({ todos }: { todos: AttentionNotice[] }) {
  const t = useTranslations("Event");
  const tNotices = useTranslations("Notices");
  /* The longer why, worded as in the alerts drawer. */
  const tBanner = useTranslations("EventPage");
  const noticeValues = useNoticeValues();

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((notice) => {
        const values = noticeValues(notice);
        const task = tNotices(`${notice.key}.task`, values);
        const action = tNotices(`${notice.key}.action`, values);

        /*
         * The whole box is the link or button, raised over the card's own
         * link, which covers the whole card. The action is read out, not
         * shown.
         */
        return (
          <li key={notice.id} className={TODO_ITEM}>
            <NoticeAction
              notice={notice}
              className="group relative z-10 flex w-full items-center gap-3 px-3 py-3.5 text-left"
            >
              <Icon
                name={TONE_ICON[notice.tone]}
                strokeWidth={2}
                className="mt-[1.5px] size-4 shrink-0 self-start text-warning-600"
              />
              {/* Worded and set as the event editor's banners. */}
              <span className="min-w-0 flex-1 meta-face leading-[1.5] text-warning-700">
                <span className={BANNER_TITLE}>
                  {task}
                  <span className="sr-only">: {action}</span>
                </span>
                <span className="block">
                  {tBanner(`${notice.key}Body`, values)}
                </span>
              </span>
              <Icon
                name="chevron"
                className="size-[13px] shrink-0 -rotate-90 text-warning-600 transition-transform group-hover:translate-x-0.5"
              />
            </NoticeAction>
            {/* A link of its own, so it sits under the box's text, not in it. */}
            {notice.reportHref ? (
              <Link
                href={notice.reportHref}
                className="relative z-10 mb-3.5 ml-10 inline-block meta-face font-semibold text-warning-700 underline underline-offset-[3px] transition-colors hover:text-neutral-950"
              >
                {t("reportFlood")}
              </Link>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
