"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import {
  BTN_PRIMARY,
  SOFT_ACTION_SHAPE,
  SOFT_OUTLINE,
  TEXT_LINK,
} from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import {
  suggestedIdSchema,
  type QuestionInput,
  type StoredQuestion,
  type SuggestedId,
} from "@/db/schemas/event";
import { QUESTIONS_MAX } from "@/lib/config";
import { newId } from "@/lib/id";
import { inputOf } from "@/lib/questions";
import type { Language } from "@/lib/language";
import { resolveQuestions } from "@/lib/suggested";
import { RollPanel } from "../design/RollOut";
import { QuestionForm } from "./QuestionForm";
import { QuestionList } from "./QuestionList";
import {
  BOX_MARK,
  BOX_MARK_STROKE,
  MARK_SLOT,
  SECTION_NAME,
} from "../design/styles";
import { QUESTION_ROW, SUGGESTION_CHIP } from "./styles";

interface RepliesTabProps {
  /** The form's questions, archived ones too, as the editor holds them. */
  questions: StoredQuestion[];
  onChange: (questions: StoredQuestion[]) => void;
  /** The invitation's language: what the suggested questions are worded in. */
  language: Language;
}

/** The open form: which question it edits, and a fresh `key` each time it opens. */
interface Draft {
  key: string;
  start: QuestionInput;
  isNew: boolean;
  answered: boolean;
}

/** Every suggested question has a chip, in the order they are offered. */
const CHIPS = suggestedIdSchema.options;

/**
 * The Form tab of both editors: what every reply asks, the form's questions
 * (ours and the host's own, dragged into order, edited inline, archived ones
 * apart), chips to add or bring back ours, and a blank question. Changes go into the
 * editor's state; Save keeps them with the invitation.
 */
export function RepliesTab({ questions, onChange, language }: RepliesTabProps) {
  const t = useTranslations("RepliesTab");
  const tSuggested = useTranslations("Suggested");
  /* The last form opened; kept while it rolls back, `rolled` says whether it is out. */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [rolled, setRolled] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  /* Resolved, so a suggested question has its wording in the invitation's language. */
  const resolved = resolveQuestions(questions, language);
  const active = resolved.filter(({ archived }) => !archived);
  const archived = resolved.filter((question) => question.archived);
  const full = active.length >= QUESTIONS_MAX;

  function open(start: QuestionInput, isNew: boolean, answered = false) {
    setDraft({ key: newId(), start, isNew, answered });
    setRolled(true);
  }

  const close = () => setRolled(false);
  /* The question whose form is out, if it is one in the list. */
  const editing = rolled && draft && !draft.isNew ? draft.start.id : null;

  /* A blank text question to start the form from. */
  function blank(): QuestionInput {
    return {
      id: newId(),
      label: "",
      kind: "text",
      scope: "reply",
      required: false,
      archived: false,
    };
  }

  /* A chip: ours is added at the end, or brought back; one already asked stays. */
  function pickSuggested(id: SuggestedId) {
    const card = questions.find((question) => question.id === id);
    if (full || (card && !card.archived)) return;
    if (card) {
      restore(id);
      return;
    }
    onChange([
      ...questions,
      {
        id,
        suggested: true,
        required: id === "age" || id === "diet",
        archived: false,
        answered: false,
      },
    ]);
  }

  function submit(question: QuestionInput) {
    if (draft?.isNew) {
      onChange([...questions, { ...question, answered: false }]);
    } else {
      onChange(
        questions.map((each) =>
          each.id === question.id
            ? { ...question, answered: each.answered }
            : each,
        ),
      );
    }
    close();
  }

  /* Nobody answered: gone. Answered: archived, its answers kept. */
  function remove(id: string) {
    onChange(
      questions.flatMap((each) => {
        if (each.id !== id) return [each];
        return each.answered ? [{ ...each, archived: true }] : [];
      }),
    );
    if (draft?.start.id === id) close();
  }

  function restore(id: string) {
    if (full) return;
    onChange(
      questions.map((each) =>
        each.id === id ? { ...each, archived: false } : each,
      ),
    );
  }

  const form = draft ? (
    <QuestionForm
      key={draft.key}
      start={draft.start}
      isNew={draft.isNew}
      answered={draft.answered}
      suggestedLabel={resolved.find(({ id }) => id === draft.start.id)?.label}
      attached={!draft.isNew}
      onRemove={draft.isNew ? undefined : () => remove(draft.start.id)}
      onSubmit={submit}
      onCancel={close}
    />
  ) : null;

  return (
    <div className="mb-8 flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <EditorHeading
          title={`${t("yourQuestions")} · ${t("count", { count: active.length, max: QUESTIONS_MAX })}`}
          className="mb-0!"
        />
        <div className="flex flex-col">
          {active.length > 0 ? (
            <QuestionList
              questions={active}
              editing={editing}
              formOf={draft && !draft.isNew ? draft.start.id : null}
              form={form}
              onReorder={(order) =>
                onChange([
                  ...order.flatMap(({ id }) =>
                    questions.filter((question) => question.id === id),
                  ),
                  ...questions.filter((question) => question.archived),
                ])
              }
              onToggle={(question) => {
                if (editing === question.id) {
                  close();
                  return;
                }
                const card = questions.find(({ id }) => id === question.id);
                if (card) open(inputOf(card), false, card.answered);
              }}
            />
          ) : (
            <p className="hint-text text-neutral-700">{t("none")}</p>
          )}
          {/* A new question's form, under the list; one being edited rolls out under its own bar. */}
          <RollPanel
            id="new-question-form"
            open={rolled && Boolean(draft?.isNew)}
            lazy
          >
            <div className="overflow-hidden">
              <div className="pt-3">{draft?.isNew ? form : null}</div>
            </div>
          </RollPanel>
        </div>
        {archived.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              aria-expanded={showArchived}
              onClick={() => setShowArchived(!showArchived)}
              className={`${TEXT_LINK} self-start hint-face`}
            >
              {showArchived
                ? t("hideArchived")
                : t("showArchived", { count: archived.length })}
            </button>
            {showArchived
              ? archived.map((question) => (
                  <div key={question.id} className={QUESTION_ROW}>
                    {/* Hidden from the form: the Archive button's eye, where the handle sits. */}
                    <span className={`${MARK_SLOT} h-8 self-center`}>
                      <Icon
                        name="eyeOff"
                        className={`${BOX_MARK} w-[22px]`}
                        strokeWidth={BOX_MARK_STROKE}
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={`${SECTION_NAME} truncate`}>
                        {question.label}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={full}
                      onClick={() => restore(question.id)}
                      className={`${SOFT_ACTION_SHAPE} ${SOFT_OUTLINE}`}
                    >
                      {t("restore")}
                    </button>
                  </div>
                ))
              : null}
          </div>
        ) : null}
        {full ? (
          <p className="hint-text text-neutral-700">{t("full")}</p>
        ) : null}
      </section>

      <section>
        <EditorHeading title={t("suggestions")} />
        <ul className="flex flex-wrap gap-1.5">
          {CHIPS.map((id) => {
            const added = active.some((question) => question.id === id);
            const name = tSuggested(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={full}
                  aria-label={added ? t("added", { name }) : undefined}
                  onClick={() => pickSuggested(id)}
                  className={`${SUGGESTION_CHIP} ${added ? "opacity-60" : ""}`}
                >
                  <Icon name={added ? "check" : "plus"} className="size-3.5" />
                  {name}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <button
        type="button"
        disabled={full}
        onClick={() => open(blank(), true)}
        className={`${BTN_PRIMARY} w-full`}
      >
        <Icon name="plus" className="size-4" />
        {t("writeOwn")}
      </button>
    </div>
  );
}
