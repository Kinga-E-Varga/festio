import { useLocale, useTranslations } from "next-intl";
import { formatRelative } from "@/lib/event";
import { BOX_ROW, SUCCESS_DARK } from "@/components/dashboard/styles";
import type { RsvpActivity } from "@/types/dashboard";

/**
 * The latest replies: who answered, across every event in the side panel, or
 * one event's alone on its Overview.
 */
export function RepliesList({
  entries,
  single = false,
}: {
  /** The latest first. */
  entries: RsvpActivity[];
  /** One event's alone, on its Overview: no event name on each line. */
  single?: boolean;
}) {
  const t = useTranslations("Rail");
  const tActivity = useTranslations("Activity");
  const locale = useLocale();

  if (entries.length === 0) {
    return <p className="muted-text">{t("noReplies")}</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li
          key={entry.id}
          className={`flex gap-2.5 py-2.5 first:pt-0 last:pb-0 wide:gap-[11px] wide:py-3 ${BOX_ROW}`}
        >
          <span
            aria-hidden="true"
            className={`grid size-6 shrink-0 place-items-center wide:size-7 rounded-full border text-[10px] font-semibold ${SUCCESS_DARK}`}
          >
            {entry.initials}
          </span>
          <div className="min-w-0 panel-text leading-[1.45]">
            <p>
              {/* The sentence places the names; which word comes first is the language's business. */}
              {tActivity.rich(entry.action.key, {
                ...entry.action.values,
                actor: entry.actor ?? "",
                b: (chunks) => <span className="strong-text">{chunks}</span>,
              })}
            </p>
            <p className="mt-0.5 hint-text">
              {[
                ...(single ? [] : [entry.event]),
                ...(entry.details?.length
                  ? [
                      entry.details
                        .map((detail) => tActivity(detail.key, detail.values))
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
  );
}
