import { useLocale, useTranslations } from "next-intl";
import { Fragment } from "react";
import { formatRelative } from "@/lib/event";
import { AttentionTag } from "@/components/dashboard/AttentionTag";
import {
  BOX_ROW,
  DANGER_SOFT,
  SUCCESS_SOFT,
} from "@/components/dashboard/styles";
import type { RsvpActivity } from "@/types/dashboard";

/**
 * The initials' circle in the tags' colours: red when the reply carries one
 * (Unknown, Duplicate, `DANGER_SOFT`), else Coming's tag's green.
 */
const INITIALS_TONE = { attention: DANGER_SOFT, fine: SUCCESS_SOFT } as const;

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
            className={`grid size-6 shrink-0 place-items-center wide:size-7 rounded-full border text-[10px] font-semibold ${
              INITIALS_TONE[entry.tags.length > 0 ? "attention" : "fine"]
            }`}
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
              {entry.tags.map((tag) => (
                <Fragment key={tag}>
                  {" "}
                  <AttentionTag
                    tag={tag}
                    className="inline-block align-[1px]"
                  />
                </Fragment>
              ))}
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

/** Rows the latest replies' shape, while they load. */
const SKELETON_ROWS = 4;

/** The side panel's latest replies: a skeleton until they first arrive, then the list. */
export function LatestReplies({
  entries,
  failed,
}: {
  entries: RsvpActivity[] | null;
  failed: boolean;
}) {
  const t = useTranslations("Rail");

  if (entries) return <RepliesList entries={entries} />;
  if (failed) return <p className="muted-text">{t("repliesFailed")}</p>;
  return (
    <div role="status">
      <span className="sr-only">{t("repliesLoading")}</span>
      <ul aria-hidden="true" className="animate-pulse">
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <li
            key={row}
            className={`flex gap-2.5 py-2.5 first:pt-0 last:pb-0 wide:gap-[11px] wide:py-3 ${BOX_ROW}`}
          >
            <span className="size-6 shrink-0 rounded-full bg-neutral-200 wide:size-7" />
            <div className="flex-1 pt-0.5">
              <div className="h-3 w-3/4 rounded-ui bg-neutral-200" />
              <div className="mt-2 h-2.5 w-1/2 rounded-ui bg-neutral-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
