"use client";

import { Select } from "@/components/dashboard/event-editor/Select";
import { useTranslations } from "next-intl";
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
  type UseFormRegisterReturn,
} from "react-hook-form";
import { ERROR, INPUT } from "@/components/dashboard/styles";
import { MultiSelect } from "@/components/dashboard/guest-list/MultiSelect";
import {
  pickNeeds,
  STATUS_KEY,
} from "@/components/dashboard/guest-list/labels";
import { useQuestionWords } from "@/components/dashboard/guest-list/useQuestionWords";
import {
  CHOICE_OFF,
  CHOICE_ON,
} from "@/components/dashboard/guest-list/styles";
import { RSVP_ANSWER_MAX, RSVP_NAME_MAX } from "@/db/limits";
import type { GuestQuestion, PersonValues, ReplyValues } from "@/types/guests";

interface NameFieldProps {
  registration: UseFormRegisterReturn;
  error?: string;
}

export function NameField({ registration, error }: NameFieldProps) {
  const t = useTranslations("GuestList");
  return (
    <label className="block min-w-[200px] flex-1">
      <span className="mb-1.5 block label-caps">{t("name")}</span>
      <input {...registration} maxLength={RSVP_NAME_MAX} className={INPUT} />
      {error ? <span className={`mt-1 block ${ERROR}`}>{error}</span> : null}
    </label>
  );
}

interface ChoicesProps<T extends string> {
  legend: string;
  options: { value: T; label: string }[];
  picked: (value: T) => boolean;
  onPick: (value: T) => void;
  error?: string;
}

/** A row of pickable chips, as tall as an input; `onPick` decides which are picked. */
export function Choices<T extends string>({
  legend,
  options,
  picked,
  onPick,
  error,
}: ChoicesProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 label-caps">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={picked(option.value)}
            onClick={() => onPick(option.value)}
            className={picked(option.value) ? CHOICE_ON : CHOICE_OFF}
          >
            {option.label}
          </button>
        ))}
      </div>
      {error ? <p className={`mt-1 ${ERROR}`}>{error}</p> : null}
    </fieldset>
  );
}

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/** One pick from a dropdown; its empty first option is unanswered. */
function SelectField({
  label,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps) {
  const t = useTranslations("GuestList");
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block label-caps">{label}</span>
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={
          value === "" ? "text-neutral-600! [&_option]:text-neutral-950" : ""
        }
      >
        <option value="">{t("choose")}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      {error ? <span className={`mt-1 block ${ERROR}`}>{error}</span> : null}
    </label>
  );
}

const STATUSES = Object.keys(STATUS_KEY) as ReplyValues["status"][];

export function StatusField({ control }: { control: Control<ReplyValues> }) {
  const t = useTranslations("GuestList");
  return (
    <Controller
      control={control}
      name="status"
      render={({ field }) => (
        <Choices
          legend={t("status")}
          options={STATUSES.map((status) => ({
            value: status,
            label: t(STATUS_KEY[status]),
          }))}
          picked={(value) => field.value === value}
          onPick={field.onChange}
        />
      )}
    />
  );
}

interface PersonFieldsProps {
  control: Control<ReplyValues>;
  index: number;
  questions: GuestQuestion[];
  register: UseFormRegister<ReplyValues>;
  /** The person as the form holds them now: Other's words are asked for once it is picked. */
  values?: PersonValues;
  errors?: FieldErrors<ReplyValues>["people"];
}

/** One person's questions in the form's order: a needs question has its own field, the rest a field each. Nothing is required but Other's words. */
export function PersonFields({
  control,
  index,
  questions,
  register,
  values,
  errors,
}: PersonFieldsProps) {
  const t = useTranslations("GuestList");
  const words = useQuestionWords();
  return (
    <>
      {questions.map((question) => {
        if (question.kind !== "needs") {
          return (
            <QuestionField
              key={question.id}
              control={control}
              name={`people.${index}.answers.${question.id}`}
              question={question}
            />
          );
        }
        const withOther =
          values?.needs[question.id]?.picks.includes("other") ?? false;
        const otherError =
          errors?.[index]?.needs?.[question.id]?.other?.message;
        return (
          <div key={question.id}>
            <Controller
              control={control}
              name={`people.${index}.needs.${question.id}.picks`}
              render={({ field }) => (
                <MultiSelect
                  label={words.title(question)}
                  placeholder={t("choose")}
                  options={[
                    { value: "none", label: t("needsNone") },
                    ...question.options.map(({ id }) => ({
                      value: id,
                      label: words.option(question, id),
                    })),
                  ]}
                  value={field.value}
                  onPick={(value) =>
                    field.onChange(pickNeeds(field.value, value))
                  }
                />
              )}
            />
            {withOther ? (
              <input
                {...register(`people.${index}.needs.${question.id}.other`, {
                  /* Other alone tells nothing: picked, its words are required. */
                  validate: (value, all) =>
                    all.status !== "going" ||
                    !all.people[index]?.needs[question.id]?.picks.includes(
                      "other",
                    ) ||
                    value.trim() !== "" ||
                    t("otherRequired"),
                })}
                maxLength={RSVP_ANSWER_MAX}
                aria-label={t("otherInput")}
                placeholder={t("otherInput")}
                className={`mt-2 ${INPUT}`}
              />
            ) : null}
            {withOther && otherError ? (
              <p className={`mt-1 ${ERROR}`}>{otherError}</p>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

interface QuestionFieldProps {
  control: Control<ReplyValues>;
  name: `people.${number}.answers.${string}` | `shared.${string}`;
  question: GuestQuestion;
}

/** A question, never required here: a choice's empty option, or a yes/no clicked again, goes back to unanswered. */
export function QuestionField({ control, name, question }: QuestionFieldProps) {
  const t = useTranslations("GuestList");
  const words = useQuestionWords();
  const label = words.title(question);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";
        if (question.kind === "text") {
          return (
            <label className="block min-w-0">
              <span className="mb-1.5 block label-caps">{label}</span>
              <input
                ref={field.ref}
                name={field.name}
                value={value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                maxLength={RSVP_ANSWER_MAX}
                className={INPUT}
              />
            </label>
          );
        }
        if (question.kind === "choice") {
          return (
            <SelectField
              label={label}
              options={question.options.map((option) => ({
                value: option.id,
                label: words.option(question, option.id),
              }))}
              value={value}
              onChange={field.onChange}
            />
          );
        }
        const options = [
          { value: "yes", label: t("summaryYes") },
          { value: "no", label: t("summaryNo") },
        ];
        return (
          <Choices
            legend={label}
            options={options}
            picked={(option) => value === option}
            onPick={(option) => field.onChange(value === option ? "" : option)}
          />
        );
      }}
    />
  );
}
