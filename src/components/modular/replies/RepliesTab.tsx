"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { EditorHeading } from "@/components/dashboard/event-editor/EditorSection";
import {
  BTN_PRIMARY,
  SOFT_ACTION_SHAPE,
  SOFT_OUTLINE,
  TAG,
  TEXT_LINK,
} from "@/components/dashboard/styles";
import { Icon } from "@/components/icons";
import type { Question, QuestionInput } from "@/db/schemas/event";
import { QUESTIONS_MAX } from "@/lib/config";
import { newId } from "@/lib/id";
import { inputOf } from "@/lib/questions";
import { localized, type Language } from "@/lib/language";
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
import { SUGGESTIONS } from "./suggestions";

interface RepliesTabProps {
  /** The host's questions, archived ones too, as the editor holds them. */
  questions: Question[];
  onChange: (questions: Question[]) => void;
  /** The invitation's language: what the suggestions are worded in. */
  language: Language;
}

/** The open form: which question it edits, and a fresh `key` each time it opens. */
interface Draft {
  key: string;
  start: QuestionInput;
  isNew: boolean;
  answered: boolean;
}

const FIXED = ["fixedName", "fixedAge", "fixedDiet"] as const;

/**
 * The modular editor's Replies tab: what every reply asks, the host's own
 * questions (dragged into order, edited inline, archived ones apart), our
 * suggestions to start from, and a blank question. Changes go into the
 * editor's state; Save keeps them with the invitation.
 */
export function RepliesTab({ questions, onChange, language }: RepliesTabProps) {
  const t = useTranslations("RepliesTab");
  /* The last form opened; kept while it rolls back, `rolled` says whether it is out. */
  const [draft, setDraft] = useState<Draft | null>(null);
  const [rolled, setRolled] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const active = questions.filter(({ archived }) => !archived);
  const archived = questions.filter((question) => question.archived);
  const full = active.length >= QUESTIONS_MAX;

  function open(start: QuestionInput, isNew: boolean, answered = false) {
    setDraft({ key: newId(), start, isNew, answered });
    setRolled(true);
  }

  const close = () => setRolled(false);
  /* The question whose form is out, if it is one in the list. */
  const editing = rolled && draft && !draft.isNew ? draft.start.id : null;

  /* A new question to start the form from: a suggestion's, or a blank text one. */
  function blank(
    start: Pick<QuestionInput, "scope" | "label"> & {
      kind: "yesNo" | "text";
    } = { label: "", kind: "text", scope: "reply" },
  ): QuestionInput {
    return { ...start, id: newId(), required: false, archived: false };
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
      attached={!draft.isNew}
      onRemove={draft.isNew ? undefined : () => remove(draft.start.id)}
      onSubmit={submit}
      onCancel={close}
    />
  ) : null;

  return (
    <div className="mb-8 flex flex-col gap-8">
      <section>
        <EditorHeading title={t("alwaysAsked")} />
        <ul className="flex flex-wrap gap-1.5">
          {FIXED.map((key) => (
            <li
              key={key}
              className={`${TAG} inline-flex items-center gap-1 border-neutral-400 bg-neutral-150 text-neutral-700`}
            >
              <Icon name="lock" className="size-3" />
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

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
              onReorder={(order) => onChange([...order, ...archived])}
              onToggle={(question) =>
                editing === question.id
                  ? close()
                  : open(inputOf(question), false, question.answered)
              }
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
          {SUGGESTIONS.map((suggestion) => {
            const label = localized(suggestion.label, language);
            const added = active.some(
              (question) => question.label.trim() === label,
            );
            const name = t(`suggestion.${suggestion.id}`);
            return (
              <li key={suggestion.id}>
                <button
                  type="button"
                  disabled={full}
                  aria-label={added ? t("added", { name }) : undefined}
                  onClick={() =>
                    open(
                      blank({
                        label,
                        kind: suggestion.kind,
                        scope: suggestion.scope,
                      }),
                      true,
                    )
                  }
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
