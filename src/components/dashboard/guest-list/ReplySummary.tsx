"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { DIET_KEY } from "@/components/dashboard/guest-list/RowView";
import { Icon } from "@/components/icons";
import type { AgeGroup, DietNeed, GuestCounts, GuestTally, QuestionTally } from "@/types/guests";

interface ReplySummaryProps {
  tally: GuestTally;
  counts: GuestCounts;
  useList: boolean;
}

interface Line {
  key: string;
  label: ReactNode;
  /** Left out when the label already reads as a sentence with its number. */
  count?: number;
  /** Shown even at 0. */
  keep?: boolean;
}

const AGE_KEYS: Record<AgeGroup, "summaryAdults" | "summaryChildren" | "summaryBabies"> = {
  adult: "summaryAdults",
  child: "summaryChildren",
  baby: "summaryBabies",
};

/** Three columns wide, two in between, one on a phone. */
const GRID = "grid gap-x-10 gap-y-8 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-3";

/** The numbers a host plans with, one small table per question. */
export function ReplySummary({ tally, counts, useList }: ReplySummaryProps) {
  const t = useTranslations("GuestList");
  const [open, setOpen] = useState(false);

  function questionLines({ question, answers, answered }: QuestionTally): Line[] {
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
    return answered > 0 ? [{ key: "answered", label: t("summaryAnswered", { count: answered }) }] : [];
  }

  return (
    /* The same sheet as the guest list table below. */
    <div className="border border-mustard-300 bg-neutral-50 px-4 py-4 @min-[720px]:px-5">
      <div className={GRID}>
        <Block
          title={t("summaryReplies")}
          lines={[
            { key: "going", label: t("statusGoing"), count: counts.going, keep: true },
            { key: "notGoing", label: t("statusNotGoing"), count: counts.notGoing, keep: true },
            ...(useList ? [{ key: "waiting", label: t("categoryWaiting"), count: counts.waiting }] : []),
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
        />
        {/*
         * Custom answers and messages wait behind the toggle; the three above
         * always show. Same grid, so they fill the gap beside Dietary needs.
         */}
        {tally.questions.map((entry) => (
          <Block key={entry.question.id} title={entry.question.label} lines={questionLines(entry)} folded={!open} />
        ))}
        <Block
          title={t("summaryMessagesTitle")}
          lines={
            tally.messages > 0 ? [{ key: "messages", label: t("summaryMessages", { count: tally.messages }) }] : []
          }
          folded={!open}
        />
      </div>
      {/* Under what it opens. */}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-forest-500 underline underline-offset-[3px] transition-colors hover:text-forest-600"
      >
        {t(open ? "summaryLess" : "summaryMore")}
        <Icon name="chevron" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>
    </div>
  );
}

interface BlockProps {
  title: string;
  lines: Line[];
  /** Set on the blocks behind the toggle: hidden while true, fading in and out as it turns. */
  folded?: boolean;
}

/**
 * A block the toggle shows fades in, and fades out before it hides: `display`
 * waits out the fade (`transition-discrete`). Browsers without that just hide it.
 */
const FADE = "transition-[opacity,display] transition-discrete duration-300 starting:opacity-0 motion-reduce:transition-none";

/** A title, then label-and-number rows; rows at 0 drop out unless kept. */
function Block({ title, lines, folded }: BlockProps) {
  const t = useTranslations("GuestList");
  const shown = lines.filter((line) => line.keep || line.count === undefined || line.count > 0);

  return (
    <section className={`min-w-0 ${folded === undefined ? "" : `${FADE} ${folded ? "hidden opacity-0" : ""}`}`}>
      <h3 className="bg-mustard-200 px-3 py-1.5 font-serif text-[14px] text-neutral-900">{title}</h3>
      {shown.length > 0 ? (
        <dl>
          {shown.map((line) => (
            <div
              key={line.key}
              className="flex items-baseline justify-between gap-4 border-b border-mustard-200 px-3 py-2 text-[13px] text-neutral-800"
            >
              <dt className="min-w-0">{line.label}</dt>
              {line.count !== undefined ? (
                <dd className="font-medium text-neutral-900 tabular-nums">{line.count}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      ) : (
        <p className="border-b border-mustard-200 px-3 py-2 text-[13px] text-neutral-600">{t("summaryEmpty")}</p>
      )}
    </section>
  );
}
