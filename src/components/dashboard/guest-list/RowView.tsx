"use client";

import { useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useState } from "react";
import {
  ICON_BTN,
  ICON_BTN_DANGER,
  SUCCESS_DARK,
  TAG,
  TAG_PAD,
  TAG_TEXT,
  WARNING_DARK,
} from "@/components/dashboard/styles";
import {
  AGE_KEY,
  DIET_KEY,
  STATUS_KEY,
} from "@/components/dashboard/guest-list/labels";
import {
  ALERT,
  fold,
  SMALL_BTN_WARN,
  SMALL_BTN_WARN_SOLID,
  STATUS_FILL,
} from "@/components/dashboard/guest-list/styles";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { AttentionTag } from "@/components/dashboard/AttentionTag";
import { DeleteConfirm } from "@/components/dashboard/guest-list/DeleteConfirm";
import { UnknownFix } from "@/components/dashboard/guest-list/UnknownFix";
import { Icon, FoldChevron } from "@/components/icons";
import { rowName, showsUnknown } from "@/lib/guests";
import type {
  AnswerValue,
  DietNeed,
  GuestQuestion,
  GuestReply,
  GuestRow,
  ListName,
} from "@/types/guests";

interface RowViewProps {
  row: GuestRow;
  /** The others in this person's reply: while there are any, Separate takes Delete's place. */
  party: string[];
  /** The first row shown of a reply: it carries the reply's status, which covers everyone in it. */
  lead: boolean;
  waiting: ListName[];
  /** The host's own questions, for their answers in the details. */
  questions: GuestQuestion[];
  actions: GuestActions;
  onEdit: () => void;
  /** Holds an action back while another row has unsaved changes. */
  guard: (action: () => void) => void;
  /** Sits in a duplicate card: the row lays out against the card. */
  inCard?: boolean;
}

const STATUS_TONE = {
  going: SUCCESS_DARK,
  not_going: WARNING_DARK,
} as const;

/** A waiting name's invite, a tag like the status that ticks on a click. Sent or not it looks the same; only its words and the box change. */
const INVITE_TAG =
  "cursor-pointer border-neutral-400 bg-neutral-100 text-neutral-700 transition-colors hover:border-neutral-600 hover:text-neutral-950";

/*
 * A waiting name's row: the name's tag sits beside it from `name` on, and the
 * invite badge joins the line at `grid`, under the name before that. A
 * duplicate card is its own, narrower container, so it switches sooner.
 */
const LAYOUT = {
  table: {
    grid: "@min-[480px]:grid-cols-[minmax(0,1fr)_auto_auto]",
    name: "@min-[440px]:flex-row @min-[440px]:items-center @min-[440px]:gap-2 @min-[480px]:self-auto",
    badge: "@min-[480px]:col-start-auto @min-[480px]:row-start-auto",
    actions:
      "@min-[480px]:col-start-auto @min-[480px]:row-start-auto @min-[480px]:self-auto",
  },
  card: {
    grid: "@min-[300px]:grid-cols-[minmax(0,1fr)_auto_auto]",
    name: "@min-[260px]:flex-row @min-[260px]:items-center @min-[260px]:gap-2 @min-[300px]:self-auto",
    badge: "@min-[300px]:col-start-auto @min-[300px]:row-start-auto",
    actions:
      "@min-[300px]:col-start-auto @min-[300px]:row-start-auto @min-[300px]:self-auto",
  },
} as const;

/*
 * A reply's row: name, status at the right beside the buttons, buttons. The
 * status column goes on the guest list's own width (`@container/guests` in
 * `GuestManager`), not the row's or a duplicate card's, so every tag on the
 * page goes at once.
 */
const REPLY_GRID =
  "grid-cols-[minmax(0,1fr)_auto] @min-[480px]/guests:grid-cols-[minmax(0,1fr)_auto_auto]";
const REPLY_STATUS = "hidden @min-[480px]/guests:flex";
/* Needs attention keeps the column: narrow, its tag turns into a dot in the same place. */
const ATTENTION_GRID = "grid-cols-[minmax(0,1fr)_auto_auto]";
const WIDE_ONLY = "hidden @min-[480px]/guests:inline";
const NARROW_ONLY = "@min-[480px]/guests:hidden";

/**
 * Name and tags · the status (a reply) or the invite badge (a waiting name) ·
 * edit and delete (or separate) · the fold. In a group only the lead row shows
 * the status: it's the whole reply's. On a narrow list the status is left out
 * rather than moved under the name (the card says it too); in Needs attention,
 * whose card doesn't, it shrinks to a dot in its colour instead. Narrow screens put
 * the invite badge under the name and keep edit and delete on the name's line,
 * at the right; a long name is cut short to make room. A row with answers opens on a click anywhere
 * that isn't one of its own controls, like a category band.
 */
export function RowView({
  row,
  party,
  lead,
  waiting,
  questions,
  actions,
  onEdit,
  guard,
  inCard = false,
}: RowViewProps) {
  const layout = LAYOUT[inCard ? "card" : "table"];
  const t = useTranslations("GuestList");
  const locale = useLocale();
  const [confirming, setConfirming] = useState<"delete" | "separate" | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const name = rowName(row);
  const reply = row.kind === "reply" ? row : null;
  const unknown = showsUnknown(row);
  /* In Needs attention: an unknown name, or a reply in a duplicate card. */
  const attention = unknown || inCard;
  /* Someone in a group is separated first, then deleted on their own. */
  const grouped = party.length > 0;
  const listFormat = new Intl.ListFormat(locale);
  /* The extra questions are asked only of people coming; a message can come with any reply. */
  const hasDetails =
    reply !== null &&
    (reply.reply.ageGroup !== undefined ||
      reply.reply.diet !== undefined ||
      questions.some(
        (question) => reply.reply.answers?.[question.id] !== undefined,
      ) ||
      reply.reply.note !== null);

  function remove() {
    if (row.kind === "reply") actions.removeReplies([row.reply.id]);
    else actions.removeListName(row.listName.id);
  }

  function toggle(event: MouseEvent<HTMLDivElement>) {
    if (!hasDetails || (event.target as Element).closest("button, a, input"))
      return;
    setOpen(!open);
  }

  return (
    <div>
      {/* The fold's button is there for the keyboard; a mouse can use the whole row. */}
      <div
        onClick={toggle}
        className={`grid min-h-10 items-center gap-x-4 gap-y-1 py-1 ${reply ? (attention ? ATTENTION_GRID : REPLY_GRID) : `grid-cols-[minmax(0,1fr)_auto] ${layout.grid}`} ${
          hasDetails ? "cursor-pointer" : ""
        }`}
      >
        {/*
         * Narrowest, the tag sits under the name on every row; else beside it. The
         * name's line is as tall as the buttons and pinned to the top with them,
         * so the thread's dot stays on the name.
         */}
        <div
          className={`flex min-w-0 flex-col items-start self-start ${layout.name}`}
        >
          {/* The name and its arrow never part: a long name is cut short instead. */}
          <span className="flex min-h-8 max-w-full min-w-0 items-center gap-1">
            <span className="min-w-0 truncate name-text">{name}</span>
            {hasDetails ? (
              <button
                type="button"
                aria-expanded={open}
                aria-label={t("detailsFor", { name })}
                onClick={() => setOpen(!open)}
                className="grid size-6 shrink-0 cursor-pointer place-items-center text-neutral-600"
              >
                <FoldChevron open={open} />
              </button>
            ) : null}
          </span>
          {unknown ? <AttentionTag tag="unknown" /> : null}
        </div>

        {row.kind === "reply" ? (
          /* On the name's line, as tall as it; empty on a group's other rows. */
          <div
            className={`h-8 items-center self-start ${attention ? "flex" : REPLY_STATUS}`}
          >
            {lead ? (
              <>
                <span
                  className={`${attention ? WIDE_ONLY : ""} ${TAG} ${STATUS_TONE[row.reply.status]}`}
                >
                  {t(STATUS_KEY[row.reply.status])}
                </span>
                {attention ? (
                  <span
                    role="img"
                    aria-label={t(STATUS_KEY[row.reply.status])}
                    className={`size-2 rounded-full ${STATUS_FILL[row.reply.status]} ${NARROW_ONLY}`}
                  />
                ) : null}
              </>
            ) : null}
          </div>
        ) : (
          <div
            className={`col-start-1 row-start-2 flex items-center gap-2 ${layout.badge}`}
          >
            {/* One badge that flips the invite either way; the box says which. */}
            <button
              type="button"
              role="checkbox"
              aria-checked={row.listName.sent}
              aria-label={t("inviteSentFor", { name })}
              onClick={() => actions.toggleSent(row.listName)}
              className={`inline-flex items-stretch overflow-hidden rounded-ui border ${TAG_TEXT} ${INVITE_TAG}`}
            >
              {/* The tick's own box, full height, stuck to the tag's left side. */}
              <span className="grid w-[18px] shrink-0 place-items-center border-r border-inherit">
                {row.listName.sent ? (
                  <Icon name="check" className="size-3" strokeWidth={2.25} />
                ) : null}
              </span>
              {/* Both labels share one cell, so the tag keeps one width sent or not, in any language. */}
              <span className={`grid text-center ${TAG_PAD}`}>
                <span
                  className={`[grid-area:1/1] ${row.listName.sent ? "" : "invisible"}`}
                >
                  {t("invitationSent")}
                </span>
                <span
                  className={`[grid-area:1/1] ${row.listName.sent ? "invisible" : ""}`}
                >
                  {t("invitationNotSent")}
                </span>
              </span>
            </button>
          </div>
        )}

        <div
          className={`flex items-center self-start ${reply ? "" : `col-start-2 row-start-1 ${layout.actions}`}`}
        >
          {/* Opens the whole reply, at this person. */}
          <button
            type="button"
            onClick={onEdit}
            aria-label={t("editLabel", { name })}
            data-tip={t("editLabel", { name })}
            className={ICON_BTN}
          >
            <Icon name="pencil" className="size-[18px]" />
          </button>
          {grouped ? (
            <button
              type="button"
              onClick={() => guard(() => setConfirming("separate"))}
              aria-label={t("separateLabel", { name })}
              data-tip={t("separateLabel", { name })}
              className={ICON_BTN}
            >
              <Icon name="leave" className="size-[18px]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => guard(() => setConfirming("delete"))}
              aria-label={t("deleteLabel", { name })}
              data-tip={t("deleteLabel", { name })}
              className={`group ${ICON_BTN_DANGER}`}
            >
              <Icon
                name="trash"
                className="size-[18px] group-hover:stroke-[1.85]"
              />
            </button>
          )}
        </div>
      </div>

      {/* Grows from and shrinks to nothing, like a category; `inert` keeps it out of reach while folded. */}
      {hasDetails && reply ? (
        <div inert={!open} className={fold(open)}>
          <div className="min-h-0 overflow-hidden">
            <ReplyDetails
              reply={reply.reply}
              questions={questions}
              spaced={unknown}
            />
          </div>
        </div>
      ) : null}

      {/* A shared name is sorted out first; its card holds that choice. */}
      {reply && unknown ? (
        <UnknownFix
          reply={reply.reply}
          waiting={waiting}
          actions={actions}
          guard={guard}
        />
      ) : null}

      {confirming === "delete" ? (
        <DeleteConfirm
          message={t("deleteConfirm", { name })}
          keepLabel={t("cancel")}
          onKeep={() => setConfirming(null)}
          onDelete={remove}
        />
      ) : null}

      {/* Can't be undone, so it asks first. */}
      {confirming === "separate" && reply ? (
        <div
          role="alert"
          className={`mb-2 ${ALERT} flex flex-wrap items-center gap-2.5`}
        >
          <span className="mr-auto">
            {t("separateConfirm", {
              name,
              names: listFormat.format(party),
            })}
          </span>
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={() => setConfirming(null)}
              className={SMALL_BTN_WARN}
            >
              {t("keepTogether")}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(null);
                actions.separate(reply.reply.id);
              }}
              className={SMALL_BTN_WARN_SOLID}
            >
              {t("separateOk")}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface ReplyDetailsProps {
  reply: GuestReply;
  questions: GuestQuestion[];
  /** The unknown fix line follows: leave it more room, so the two don't read as one. */
  spaced: boolean;
}

/** What the person answered beyond their name and status. A question never asked shows nothing. */
function ReplyDetails({ reply, questions, spaced }: ReplyDetailsProps) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  const { ageGroup, diet, note } = reply;

  function dietText(needs: DietNeed[]) {
    if (needs.length === 0) return t("dietNone");
    /* The row shows what the guest wrote for Other; the summary only counts it. */
    const named = needs.map((need) =>
      need === "other" && reply.dietOther ? reply.dietOther : t(DIET_KEY[need]),
    );
    return new Intl.ListFormat(locale).format(named);
  }

  /* A choice by its option's wording, a yes/no in words, text as written. */
  function answerText(question: GuestQuestion, value: AnswerValue | null) {
    if (value === null || value === "") return t("skipped");
    if (typeof value === "boolean")
      return t(value ? "summaryYes" : "summaryNo");
    if (question.kind === "choice")
      return (
        question.options.find((option) => option.id === value)?.label ?? value
      );
    return value;
  }

  /* One line per question, so a form with many more still reads as a list. */
  const answers = [
    ageGroup === undefined
      ? null
      : {
          key: "age",
          label: t("ageLabel"),
          value: ageGroup === null ? t("skipped") : t(AGE_KEY[ageGroup]),
        },
    diet === undefined
      ? null
      : {
          key: "diet",
          label: t("dietLabel"),
          value: diet === null ? t("skipped") : dietText(diet),
        },
    ...questions.map((question) => {
      const value = reply.answers?.[question.id];
      return value === undefined
        ? null
        : {
            key: question.id,
            label: question.label,
            value: answerText(question, value),
          };
    }),
    note !== null
      ? { key: "note", label: t("messageLabel"), value: note }
      : null,
  ].filter((answer) => answer !== null);

  return (
    <dl
      className={`flex flex-col gap-y-1 pt-1 meta-face ${spaced ? "pb-5" : "pb-3"}`}
    >
      {answers.map((answer) => (
        <div key={answer.key} className="flex gap-1">
          <dt className="text-neutral-700">{answer.label}:</dt>
          <dd className="min-w-0 font-medium text-neutral-950">
            {answer.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
