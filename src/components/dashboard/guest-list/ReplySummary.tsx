"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { DIET_KEY } from "@/components/dashboard/guest-list/labels";
import { TEXT_LINK } from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import type {
  AgeGroup,
  DietNeed,
  GuestCounts,
  GuestTally,
  QuestionTally,
} from "@/types/guests";

interface ReplySummaryProps {
  tally: GuestTally;
  counts: GuestCounts;
  useList: boolean;
  /** Set on the event page; shown here to read, with the way there. */
  expected: number;
  eventId: string;
}

interface Line {
  key: string;
  label: ReactNode;
  /** Left out when the label already reads as a sentence with its number. */
  count?: number;
  /** Shown even at 0. */
  keep?: boolean;
}

const AGE_KEYS: Record<
  AgeGroup,
  "summaryAdults" | "summaryChildren" | "summaryBabies"
> = {
  adult: "summaryAdults",
  child: "summaryChildren",
  baby: "summaryBabies",
};

/** Three columns wide, two in between, one on a phone. */
const GRID =
  "grid gap-x-10 gap-y-8 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-3";

/** Dietary needs' rows before "Show more"; the rest wait behind it. */
const DIET_ROWS_FOLDED = 4;

/** The numbers a host plans with, one small table per question. */
export function ReplySummary({
  tally,
  counts,
  useList,
  expected,
  eventId,
}: ReplySummaryProps) {
  const t = useTranslations("GuestList");
  const [open, setOpen] = useState(false);

  function questionLines({
    question,
    answers,
    answered,
  }: QuestionTally): Line[] {
    if (question.kind === "choice") {
      return question.options.map((option) => ({
        key: option.id,
        label: option.label,
        count: answers[option.id] ?? 0,
      }));
    }
    if (question.kind === "yesNo") {
      return [
        { key: "yes", label: t("summaryYes"), count: answers.yes ?? 0 },
        { key: "no", label: t("summaryNo"), count: answers.no ?? 0 },
      ];
    }
    return answered > 0
      ? [{ key: "answered", label: t("summaryAnswered", { count: answered }) }]
      : [];
  }

  return (
    /* The sheet, edged like the event cards. */
    <div className="rounded-ui border border-neutral-400 bg-neutral-50 px-4 py-4 @min-[720px]:px-5">
      <div className={GRID}>
        <Block
          title={t("summaryReplies")}
          lines={[
            {
              key: "going",
              label: t("statusGoing"),
              count: counts.going,
              keep: true,
            },
            {
              key: "notGoing",
              label: t("statusNotGoing"),
              count: counts.notGoing,
              keep: true,
            },
            ...(useList
              ? [
                  {
                    key: "waiting",
                    label: t("categoryWaiting"),
                    count: counts.waiting,
                  },
                ]
              : []),
            {
              key: "expected",
              label: (
                <>
                  {t("summaryExpected")}{" "}
                  <Link
                    href={`/dashboard/events/${eventId}#guests`}
                    className={`ml-1 text-[12.5px] ${TEXT_LINK}`}
                  >
                    {t("summaryChange")}
                  </Link>
                </>
              ),
              count: expected,
              keep: true,
            },
          ]}
        />
        <Block
          title={t("ageLabel")}
          lines={(Object.keys(AGE_KEYS) as AgeGroup[]).map((age) => ({
            key: age,
            label: t(AGE_KEYS[age]),
            count: tally.ages[age],
          }))}
        />
        <Block
          title={t("dietLabel")}
          lines={(Object.keys(DIET_KEY) as DietNeed[]).map((need) => ({
            key: need,
            label: t(DIET_KEY[need]),
            count: tally.diets[need],
          }))}
          limit={open ? undefined : DIET_ROWS_FOLDED}
          onMore={() => setOpen(true)}
        />
        {/*
         * Custom answers and messages wait behind the toggle; the three above
         * always show. Same grid, so they fill the gap beside Dietary needs.
         */}
        {tally.questions.map((entry) => (
          <Block
            key={entry.question.id}
            title={entry.question.label}
            lines={questionLines(entry)}
            folded={!open}
          />
        ))}
        <Block
          title={t("summaryMessagesTitle")}
          lines={
            tally.messages > 0
              ? [
                  {
                    key: "messages",
                    label: t("summaryMessages", { count: tally.messages }),
                  },
                ]
              : []
          }
          folded={!open}
        />
      </div>
      {/* Under what it opens. */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={`mt-6 inline-flex cursor-pointer items-center gap-1.5 text-[12.5px] ${TEXT_LINK}`}
      >
        {t(open ? "summaryLess" : "summaryMore")}
        <Icon
          name="chevron"
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>
    </div>
  );
}

interface BlockProps {
  title: string;
  lines: Line[];
  /** Set on the blocks behind the toggle: hidden while true, fading in and out as it turns. */
  folded?: boolean;
  /**
   * At most this many rows, counted after the empty ones drop out. When more
   * are left, the last row says how many and opens them all.
   */
  limit?: number;
  onMore?: () => void;
}

/**
 * A block the toggle shows fades in, and fades out before it hides: `display`
 * waits out the fade (`transition-discrete`). Browsers without that just hide it.
 */
const FADE =
  "transition-[opacity,display] transition-discrete duration-300 starting:opacity-0 motion-reduce:transition-none";

/** A title, then label-and-number rows; rows at 0 drop out unless kept. */
function Block({ title, lines, folded, limit, onMore }: BlockProps) {
  const t = useTranslations("GuestList");
  const all = lines.filter(
    (line) => line.keep || line.count === undefined || line.count > 0,
  );
  const cut = limit !== undefined && all.length > limit;
  const shown = cut ? all.slice(0, limit - 1) : all;

  return (
    <section
      className={`min-w-0 ${folded === undefined ? "" : `${FADE} ${folded ? "hidden opacity-0" : ""}`}`}
    >
      <h3 className="rounded-t-ui bg-neutral-200 px-3 py-1.5 text-[14px] font-medium text-neutral-950">
        {title}
      </h3>
      {shown.length > 0 ? (
        <dl>
          {shown.map((line) => (
            <div
              key={line.key}
              className="flex items-baseline justify-between gap-4 border-b border-neutral-300 px-3 py-2 text-[13.5px] text-neutral-800"
            >
              <dt className="min-w-0">{line.label}</dt>
              {line.count !== undefined ? (
                <dd className="font-medium text-neutral-950 tabular-nums">
                  {line.count}
                </dd>
              ) : null}
            </div>
          ))}
          {cut ? (
            <div className="border-b border-neutral-300 px-3 py-2 text-[13.5px]">
              <button
                type="button"
                onClick={onMore}
                className={`cursor-pointer ${TEXT_LINK}`}
              >
                {t("summaryMoreRows", { count: all.length - shown.length })}
              </button>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="border-b border-neutral-300 px-3 py-2 text-[13.5px] text-neutral-600">
          {t("summaryEmpty")}
        </p>
      )}
    </section>
  );
}
