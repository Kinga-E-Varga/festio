"use client";

import { eventPath } from "@/lib/event";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  AGE_SUMMARY_KEY,
  ACCESS_KEY,
  AGES,
  DIET_KEY,
} from "@/components/dashboard/guest-list/labels";
import { useQuestionWords } from "@/components/dashboard/guest-list/useQuestionWords";
import { LINK_TEXT, PAGE_BOX } from "@/components/dashboard/styles";
import { Link } from "@/i18n/navigation";
import type {
  AccessNeed,
  DietNeed,
  GuestCounts,
  GuestQuestion,
  GuestTally,
  QuestionTally,
} from "@/types/guests";

interface ReplySummaryProps {
  tally: GuestTally;
  /** The form's questions, archived ones too: age, diet and accessibility show only while asked. */
  questions: GuestQuestion[];
  counts: GuestCounts;
  useList: boolean;
  /** Set on the event page; shown here to read, with the way there. */
  expected: number;
  eventId: string;
}

interface Line {
  key: string;
  label: ReactNode;
  count: number;
  /** Shown even at 0. */
  keep?: boolean;
}

/** Three columns wide, two in between, one on a phone. */
const GRID =
  "grid gap-x-10 gap-y-8 @min-[560px]:grid-cols-2 @min-[860px]:grid-cols-3";

/** The numbers a host plans with, one small table per question. */
export function ReplySummary({
  tally,
  questions,
  counts,
  useList,
  expected,
  eventId,
}: ReplySummaryProps) {
  const t = useTranslations("GuestList");
  const words = useQuestionWords();
  const asked = (id: string) =>
    questions.some((question) => question.id === id && !question.archived);

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
    return [{ key: "answered", label: t("summaryAnswered"), count: answered }];
  }

  return (
    /* The sheet, edged like the event cards. */
    <div className={PAGE_BOX}>
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
                    href={`${eventPath(eventId, "details")}#guests`}
                    className={`ml-1 ${LINK_TEXT}`}
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
        {asked("age") ? (
          <Block
            title={t("ageLabel")}
            lines={AGES.map((age) => ({
              key: age,
              label: t(AGE_SUMMARY_KEY[age]),
              count: tally.ages[age],
            }))}
          />
        ) : null}
        {asked("diet") ? (
          <Block
            title={t("dietLabel")}
            lines={(Object.keys(DIET_KEY) as DietNeed[]).map((need) => ({
              key: need,
              label: t(DIET_KEY[need]),
              count: tally.diets[need],
            }))}
          />
        ) : null}
        {asked("accessibility") ? (
          <Block
            title={t("accessLabel")}
            lines={(Object.keys(ACCESS_KEY) as AccessNeed[]).map((need) => ({
              key: need,
              label: t(ACCESS_KEY[need]),
              count: tally.access[need],
            }))}
          />
        ) : null}
        {tally.questions
          .filter(
            (entry) =>
              !("suggested" in entry.question && entry.question.archived),
          )
          .map((entry) => (
            <Block
              key={entry.question.id}
              title={words.title(entry.question)}
              lines={questionLines(entry)}
            />
          ))}
        <Block
          title={t("summaryMessagesTitle")}
          lines={[
            {
              key: "messages",
              label: t("summaryMessages"),
              count: tally.messages,
            },
          ]}
        />
      </div>
    </div>
  );
}

interface BlockProps {
  title: string;
  lines: Line[];
}

/** A title, then label-and-number rows; rows at 0 drop out unless kept. */
function Block({ title, lines }: BlockProps) {
  const t = useTranslations("GuestList");
  const shown = lines.filter((line) => line.keep || line.count > 0);

  return (
    <section className="min-w-0">
      <h3 className="rounded-t-ui bg-neutral-200 px-3 py-1.5 name-text">
        {title}
      </h3>
      {shown.length > 0 ? (
        <dl>
          {shown.map((line) => (
            <div
              key={line.key}
              className="flex items-baseline justify-between gap-4 border-b border-neutral-200 px-3 py-2 row-text"
            >
              <dt className="min-w-0">{line.label}</dt>
              <dd className="font-medium text-neutral-950 tabular-nums">
                {line.count}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="border-b border-neutral-200 px-3 py-2 row-text">
          {t("summaryEmpty")}
        </p>
      )}
    </section>
  );
}
