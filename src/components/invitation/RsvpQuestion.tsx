"use client";

import { useTranslations } from "next-intl";
import { MultiSelect } from "@/components/dashboard/guest-list/MultiSelect";
import { RSVP_ANSWER_MAX } from "@/db/limits";
import type { Question } from "@/db/schemas/event";
import type { AnswerValue } from "@/types/guests";
import type { RsvpSkin } from "./RsvpForm";

interface RsvpQuestionProps {
  question: Question;
  value: AnswerValue | null | undefined;
  onChange: (value: AnswerValue | null) => void;
  skin: RsvpSkin;
  /** The field's element id, from the form's `useId` and the row's place. */
  id: string;
}

/**
 * One question of the form, the host's own or a suggested one, in the form's
 * skin: text in the name's field, yes / no as two choices like Coming / Not
 * going (a second tap unpicks), a choice (age too) as a dropdown. The wording
 * is the host's, or Festio's for a suggested one; Yes, No and Optional are
 * Festio's, in the invitation's language.
 */
export function RsvpQuestion({
  question,
  value,
  onChange,
  skin,
  id,
}: RsvpQuestionProps) {
  const t = useTranslations("Rsvp");

  if (question.kind === "choice") {
    return (
      <MultiSelect
        label={question.label}
        placeholder={t("choose")}
        options={question.options.map((option) => ({
          value: option.id,
          label: option.label,
        }))}
        value={typeof value === "string" ? [value] : []}
        onPick={(picked) => onChange(picked)}
        skin={skin.age}
        single
      />
    );
  }

  if (question.kind === "yesNo") {
    return (
      <fieldset className={`flex flex-col ${skin.space.field}`}>
        <legend className={`${skin.label} ${skin.space.legend}`}>
          {question.label}
        </legend>
        <div className="flex gap-3">
          {[true, false].map((answer) => (
            <button
              key={String(answer)}
              type="button"
              aria-pressed={value === answer}
              onClick={() => onChange(value === answer ? null : answer)}
              className={
                value === answer ? skin.choice.picked : skin.choice.unpicked
              }
            >
              {t(answer ? "yes" : "no")}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={`flex flex-col ${skin.space.field}`}>
      <label htmlFor={id} className={skin.label}>
        {question.label}
      </label>
      <input
        id={id}
        type="text"
        value={typeof value === "string" ? value : ""}
        maxLength={RSVP_ANSWER_MAX}
        placeholder={question.required ? undefined : t("notePlaceholder")}
        onChange={(control) => onChange(control.target.value)}
        className={skin.input}
      />
    </div>
  );
}
