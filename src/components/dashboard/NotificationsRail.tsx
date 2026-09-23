import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import { formatDuration, formatRelative } from "@/lib/event";
import { ATTENTION_NOTICES, RECENT_RSVPS, TIERS } from "@/mock/dashboard";
import type { NoticeTone } from "@/types/dashboard";

/** Each notice's edge colour carries through to its call to action. */
const TONE: Record<NoticeTone, string> = {
  unmatched: "border-rust-500 text-rust-600",
  deadline: "border-mustard-500 text-mustard-600",
  safeguard: "border-terracotta-500 text-terracotta-600",
  billing: "border-steel-500 text-steel-600",
};

const PANEL_LABEL =
  "mb-3.5 text-[10px] font-semibold tracking-[0.18em] text-mustard-500 uppercase";

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="mb-[22px] border-b border-mustard-300 pb-[22px] last:mb-0 last:border-b-0 last:pb-0">
      <h2 className={PANEL_LABEL}>{label}</h2>
      {children}
    </section>
  );
}

export function NotificationsRail() {
  const t = useTranslations("Rail");
  const tNotices = useTranslations("Notices");
  const tActivity = useTranslations("Activity");
  const tTiers = useTranslations("Tiers");
  const locale = useLocale();

  return (
    <div>
      <Panel label={t("needsAttention")}>
        <ul>
          {ATTENTION_NOTICES.map((notice) => {
            /* Title, body, action and context all read the same values. */
            const values = {
              ...notice.values,
              ...(notice.span
                ? { time: formatDuration(notice.span, locale) }
                : {}),
              ...(notice.tier
                ? { tier: tTiers(`${TIERS[notice.tier].key}.name`) }
                : {}),
            };
            const contextKey = `${notice.key}.context`;

            return (
              <li
                key={notice.id}
                className={`mb-3.5 border-l-4 pb-3.5 pl-3.5 last:mb-0 last:pb-0 ${TONE[notice.tone]}`}
              >
                <p className="mb-[3px] font-semibold text-neutral-900">
                  {tNotices(`${notice.key}.title`, values)}
                  {tNotices.has(contextKey) ? (
                    <span className="font-normal">
                      {" "}
                      {tNotices(contextKey, values)}
                    </span>
                  ) : null}
                </p>
                <p className="mb-1.5 text-[12.5px] leading-[1.45] text-neutral-700">
                  {tNotices(`${notice.key}.body`, values)}
                </p>
                <button
                  type="button"
                  className="text-[12.5px] font-semibold text-current underline underline-offset-[3px] transition-colors hover:text-neutral-900"
                >
                  {tNotices(`${notice.key}.action`, values)}
                </button>
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
              className="flex gap-[11px] border-t border-dotted border-mustard-300 py-3 first:border-t-0 first:pt-0"
            >
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                  entry.tag
                    ? "bg-terracotta-200 text-terracotta-600"
                    : "bg-forest-200 text-forest-600"
                }`}
              >
                {entry.initials}
              </span>
              <div className="min-w-0 text-[12.5px] leading-[1.45] text-neutral-700">
                <p>
                  {/* The sentence places the names; which word comes first is the language's business. */}
                  {tActivity.rich(entry.action.key, {
                    ...entry.action.values,
                    actor: entry.actor ?? "",
                    b: (chunks) => (
                      <span className="font-semibold text-neutral-900">
                        {chunks}
                      </span>
                    ),
                  })}
                  {entry.tag ? (
                    <>
                      {" "}
                      <span className="inline-block border border-terracotta-400 bg-terracotta-200 px-1.5 py-px align-[1px] text-[9.5px] font-semibold tracking-[0.1em] text-terracotta-600 uppercase">
                        {t("unknownTag")}
                      </span>
                    </>
                  ) : null}
                </p>
                <p className="mt-0.5 text-[11.5px]">
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

      <section className="border border-terracotta-400 bg-terracotta-200 p-5 text-terracotta-600">
        <h2 className={`${PANEL_LABEL} text-terracotta-600`}>
          {t("dataRetention")}
        </h2>
        {/*
         * Rich text rather than three glued fragments: the number sits mid
         * sentence, and where "mid" falls is the language's business.
         */}
        <p className="mb-3 text-[12.5px] leading-[1.5]">
          {t.rich("retention", {
            days: GUEST_DATA_RETENTION_DAYS,
            big: (chunks) => (
              <span className="font-serif text-[22px] align-[-2px]">
                {chunks}
              </span>
            ),
          })}
        </p>
        <p className="text-[12.5px] leading-[1.5]">
          {t.rich("controller", {
            link: (chunks) => (
              <Link
                href="/legal/terms"
                className="font-bold underline underline-offset-[3px]"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>
    </div>
  );
}
