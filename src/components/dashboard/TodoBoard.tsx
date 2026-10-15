import { useTranslations } from "next-intl";
import { Icon } from "@/components/icons";
import { NoticeAction } from "@/components/dashboard/NoticeAction";
import { WARNING_LIGHT } from "@/components/dashboard/styles";
import { noticesFor, useNoticeValues } from "@/components/dashboard/notices";
import type { DashboardEvent, IconName, NoticeTone } from "@/types/dashboard";

/** A task's kind, shown as its small icon. */
const TONE_ICON: Record<NoticeTone, IconName> = {
  attention: "alert",
  paused: "ban",
  deadline: "clock",
  billing: "billing",
  hidden: "eyeOff",
  deletion: "download",
};

/** A to-do: a small warning-tinted box of its own. */
const TODO_ITEM = `rounded-ui border ${WARNING_LIGHT} transition-colors hover:bg-warning-100`;

/**
 * What an event is waiting on, most urgent first: the rail's notices for this
 * event, each told as a task with its way to deal with it. The rail hides
 * behind a button on smaller screens, so the event's card on the dashboard
 * carries them too. Nothing waiting, no board.
 *
 * Each task says what to do, then why now, as the notifications rail words
 * it. Each is its own box, a little apart from the next: the whole box is its
 * action, with its kind's icon and a chevron.
 */
export function TodoBoard({
  event,
  className = "",
}: {
  event: DashboardEvent;
  className?: string;
}) {
  const t = useTranslations("Event");
  const tNotices = useTranslations("Notices");
  /* The longer why, worded as in the notifications rail. */
  const tBanner = useTranslations("EventPage");
  const noticeValues = useNoticeValues();
  const todos = noticesFor(event.id);
  if (todos.length === 0) return null;

  return (
    <section aria-label={t("todo")} className={className}>
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
                <span className="min-w-0 flex-1 text-[12.5px] leading-[1.5] text-warning-700">
                  <span className="mb-[3px] block font-semibold">
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
