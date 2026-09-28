"use client";

import { useLocale, useTranslations } from "next-intl";
import { type MouseEvent, useState } from "react";
import { BTN_DANGER, BTN_GHOST } from "@/components/dashboard/event-editor/styles";
import { ATTENTION_TAG, BADGE, BADGE_TEXT, BOX_BADGE, ICON_BTN, ICON_BTN_DANGER } from "@/components/dashboard/guest-list/styles";
import type { GuestActions } from "@/components/dashboard/guest-list/useGuestActions";
import { UnknownFix } from "@/components/dashboard/guest-list/UnknownFix";
import { Icon } from "@/components/icons";
import { rowName, showsUnknown } from "@/lib/guests";
import type { AgeGroup, AnswerValue, DietNeed, GuestQuestion, GuestReply, GuestRow, ListName } from "@/types/guests";

interface RowViewProps {
  row: GuestRow;
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

const STATUS = {
  going: { key: "statusGoing", tone: "border-forest-300 bg-forest-100 text-forest-600" },
  not_going: { key: "statusNotGoing", tone: "border-terracotta-300 bg-terracotta-100 text-terracotta-600" },
} as const;

/** Sent or not, the invite badge looks the same; only its words and the box change. */
const INVITE_BADGE =
  "cursor-pointer border-neutral-300 bg-neutral-100 text-neutral-700 transition-colors hover:border-neutral-500";

/*
 * Where the badge joins the name's line: at the table's own breakpoint, or
 * sooner in a duplicate card, which is its own, narrower container. The tag
 * stays beside the name well below that, cutting the name short first, and
 * only drops under it on the narrowest rows.
 */
const LAYOUT = {
  table: {
    grid: "@min-[720px]:grid-cols-[minmax(0,1fr)_auto_auto]",
    name: "@min-[440px]:flex-row @min-[440px]:items-center @min-[440px]:gap-2 @min-[720px]:self-auto",
    badge: "@min-[720px]:col-start-auto @min-[720px]:row-start-auto",
    actions: "@min-[720px]:col-start-auto @min-[720px]:row-start-auto @min-[720px]:self-auto",
  },
  card: {
    grid: "@min-[360px]:grid-cols-[minmax(0,1fr)_auto_auto]",
    name: "@min-[260px]:flex-row @min-[260px]:items-center @min-[260px]:gap-2 @min-[360px]:self-auto",
    badge: "@min-[360px]:col-start-auto @min-[360px]:row-start-auto",
    actions: "@min-[360px]:col-start-auto @min-[360px]:row-start-auto @min-[360px]:self-auto",
  },
} as const;

/**
 * Name and tags · one status badge · edit and delete · the fold. Narrow screens
 * put the badge under the name and keep edit and delete on the name's line, at
 * the right; a long name is cut short to make room. A row with answers opens on a click anywhere
 * that isn't one of its own controls, like a category band.
 */
export function RowView({ row, waiting, questions, actions, onEdit, guard, inCard = false }: RowViewProps) {
  const layout = LAYOUT[inCard ? "card" : "table"];
  const t = useTranslations("GuestList");
  const [confirming, setConfirming] = useState(false);
  const [open, setOpen] = useState(false);
  const name = rowName(row);
  const reply = row.kind === "reply" ? row : null;
  /* The extra questions are asked only of people coming; a message can come with any reply. */
  const hasDetails =
    reply !== null &&
    (reply.reply.ageGroup !== undefined ||
      reply.reply.diet !== undefined ||
      questions.some((question) => reply.reply.answers?.[question.id] !== undefined) ||
      reply.reply.note !== null);

  function remove() {
    if (row.kind === "reply") actions.removeReply(row.reply.id);
    else actions.removeListName(row.listName.id);
  }

  function toggle(event: MouseEvent<HTMLDivElement>) {
    if (!hasDetails || (event.target as Element).closest("button, a, input")) return;
    setOpen(!open);
  }

  return (
    <div>
      {/* The fold's button is there for the keyboard; a mouse can use the whole row. */}
      <div
        onClick={toggle}
        className={`grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-1 ${layout.grid} ${
          hasDetails ? "cursor-pointer" : ""
        }`}
      >
        {/*
         * Narrowest, the tag sits under the name on every row; else beside it. The
         * name's line is as tall as the buttons and pinned to the top with them,
         * so the thread's dot stays on the name.
         */}
        <div className={`flex min-w-0 flex-col items-start self-start ${layout.name}`}>
          {/* The name and its arrow never part: a long name is cut short instead. */}
          <span className="flex min-h-8 max-w-full min-w-0 items-center gap-1">
            <span className="min-w-0 truncate text-[14.5px] font-medium text-neutral-900">{name}</span>
            {hasDetails ? (
              <button
                type="button"
                aria-expanded={open}
                aria-label={t("detailsFor", { name })}
                onClick={() => setOpen(!open)}
                className="grid size-6 shrink-0 cursor-pointer place-items-center text-neutral-600"
              >
                <Icon name="chevron" className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            ) : null}
          </span>
          {showsUnknown(row) ? (
            <span className={ATTENTION_TAG}>
              {t("unknownTag")}
            </span>
          ) : null}
        </div>

        <div className={`col-start-1 row-start-2 flex items-center gap-2 ${layout.badge}`}>
          {row.kind === "reply" ? (
            <span className={`${BADGE} ${STATUS[row.reply.status].tone}`}>{t(STATUS[row.reply.status].key)}</span>
          ) : (
            /* One badge that flips the invite either way; the box says which. */
            <button
              type="button"
              role="checkbox"
              aria-checked={row.listName.sent}
              aria-label={t("inviteSentFor", { name })}
              onClick={() => actions.toggleSent(row.listName)}
              className={`${BOX_BADGE} ${INVITE_BADGE}`}
            >
              <span className="grid w-6 shrink-0 place-items-center border-r border-inherit">
                {row.listName.sent ? <Icon name="check" className="size-3.5" strokeWidth={2.25} /> : null}
              </span>
              {/* Both labels share one cell, so the badge keeps one width sent or not, in any language. */}
              <span className={`grid ${BADGE_TEXT}`}>
                <span className={`[grid-area:1/1] ${row.listName.sent ? "" : "invisible"}`}>{t("invitationSent")}</span>
                <span className={`[grid-area:1/1] ${row.listName.sent ? "invisible" : ""}`}>{t("invitationNotSent")}</span>
              </span>
            </button>
          )}
        </div>

        <div className={`col-start-2 row-start-1 flex items-center self-start ${layout.actions}`}>
          <button type="button" onClick={onEdit} aria-label={t("editLabel", { name })} className={ICON_BTN}>
            <Icon name="pencil" className="size-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => guard(() => setConfirming(true))}
            aria-label={t("deleteLabel", { name })}
            className={ICON_BTN_DANGER}
          >
            <Icon name="trash" className="size-[18px]" />
          </button>
        </div>
      </div>

      {/* Grows from and shrinks to nothing, like a category; `inert` keeps it out of reach while folded. */}
      {hasDetails && reply ? (
        <div
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <ReplyDetails reply={reply.reply} questions={questions} spaced={showsUnknown(reply)} />
          </div>
        </div>
      ) : null}

      {/* A shared name is sorted out first; its card holds that choice. */}
      {reply && showsUnknown(reply) ? <UnknownFix reply={reply.reply} waiting={waiting} actions={actions} guard={guard} /> : null}

      {confirming ? (
        <div role="alert" className="flex flex-wrap items-center gap-2.5 pb-2 text-[12.5px] text-rust-600">
          <span className="mr-auto">{t("deleteConfirm", { name })}</span>
          <div className="flex shrink-0 gap-2.5">
            <button type="button" onClick={remove} className={BTN_DANGER}>{t("delete")}</button>
            <button type="button" onClick={() => setConfirming(false)} className={BTN_GHOST}>{t("cancel")}</button>
          </div>
        </div>
      ) : null}

    </div>
  );
}

const AGE_KEY = {
  adult: "ageAdult",
  child: "ageChild",
  baby: "ageBaby",
} as const satisfies Record<AgeGroup, string>;

/** Also read by the summary, so a diet is named the same in both. */
export const DIET_KEY = {
  vegetarian: "dietVegetarian",
  vegan: "dietVegan",
  glutenFree: "dietGlutenFree",
  lactoseFree: "dietLactoseFree",
  nutAllergy: "dietNutAllergy",
  other: "dietOther",
} as const satisfies Record<DietNeed, string>;

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
    const named = needs.map((need) => (need === "other" && reply.dietOther ? reply.dietOther : t(DIET_KEY[need])));
    return new Intl.ListFormat(locale).format(named);
  }

  /* A choice by its option's wording, a yes/no in words, text as written. */
  function answerText(question: GuestQuestion, value: AnswerValue | null) {
    if (value === null || value === "") return t("skipped");
    if (typeof value === "boolean") return t(value ? "summaryYes" : "summaryNo");
    if (question.kind === "choice") return question.options.find((option) => option.id === value)?.label ?? value;
    return value;
  }

  /* One line per question, so a form with many more still reads as a list. */
  const answers = [
    ageGroup === undefined
      ? null
      : { key: "age", label: t("ageLabel"), value: ageGroup === null ? t("skipped") : t(AGE_KEY[ageGroup]) },
    diet === undefined
      ? null
      : { key: "diet", label: t("dietLabel"), value: diet === null ? t("skipped") : dietText(diet) },
    ...questions.map((question) => {
      const value = reply.answers?.[question.id];
      return value === undefined ? null : { key: question.id, label: question.label, value: answerText(question, value) };
    }),
    note !== null ? { key: "note", label: t("messageLabel"), value: note } : null,
  ].filter((answer) => answer !== null);

  return (
    <dl className={`flex flex-col gap-y-1 pt-1 text-[12.5px] ${spaced ? "pb-5" : "pb-3"}`}>
      {answers.map((answer) => (
        <div key={answer.key} className="flex gap-1">
          <dt className="text-neutral-700">{answer.label}:</dt>
          <dd className="min-w-0 font-medium text-neutral-900">{answer.value}</dd>
        </div>
      ))}
    </dl>
  );
}
