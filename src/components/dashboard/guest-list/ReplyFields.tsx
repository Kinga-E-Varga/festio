"use client";

import { useTranslations } from "next-intl";
import { type Control, Controller, type UseFormRegisterReturn } from "react-hook-form";
import { ERROR, INPUT, LABEL } from "@/components/dashboard/event-editor/styles";
import { MultiSelect } from "@/components/dashboard/guest-list/MultiSelect";
import { AGE_KEY, DIET_KEY, STATUS_KEY } from "@/components/dashboard/guest-list/labels";
import { ANSWER_LIMIT } from "@/components/dashboard/guest-list/replyValues";
import { CHOICE_OFF, CHOICE_ON } from "@/components/dashboard/guest-list/styles";
import { NAME_LIMIT } from "@/components/invitation/useRsvpForm";
import type { AgeGroup, DietPick, GuestQuestion, ReplyValues } from "@/types/guests";

interface NameFieldProps {
  registration: UseFormRegisterReturn;
  error?: string;
}

export function NameField({ registration, error }: NameFieldProps) {
  const t = useTranslations("GuestList");
  return (
    <label className="block min-w-[200px] flex-1">
      <span className={`mb-1.5 block ${LABEL}`}>{t("name")}</span>
      <input {...registration} maxLength={NAME_LIMIT} className={INPUT} />
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
export function Choices<T extends string>({ legend, options, picked, onPick, error }: ChoicesProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className={`mb-1.5 ${LABEL}`}>{legend}</legend>
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
function SelectField({ label, options, value, onChange, error }: SelectFieldProps) {
  const t = useTranslations("GuestList");
  return (
    <label className="block min-w-0">
      <span className={`mb-1.5 block ${LABEL}`}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${INPUT} cursor-pointer ${value === "" ? "text-neutral-600" : ""}`}
      >
        <option value="">{t("choose")}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
          options={STATUSES.map((status) => ({ value: status, label: t(STATUS_KEY[status]) }))}
          picked={(value) => field.value === value}
          onPick={field.onChange}
        />
      )}
    />
  );
}

const AGES = Object.keys(AGE_KEY) as AgeGroup[];

/** None first: the most common answer, and the one that clears the rest. */
const DIETS = ["none", ...(Object.keys(DIET_KEY) as (keyof typeof DIET_KEY)[])] as const;

/** None and the needs rule each other out; picking a picked one takes it back. */
function pickDiet(current: DietPick[], pick: DietPick): DietPick[] {
  if (current.includes(pick)) return current.filter((entry) => entry !== pick);
  if (pick === "none") return ["none"];
  return [...current.filter((entry) => entry !== "none"), pick];
}

interface PersonFieldsProps {
  control: Control<ReplyValues>;
  index: number;
  questions: GuestQuestion[];
  /** Whether age and diet must be answered, given the status picked. */
  requireAge: (status: ReplyValues["status"]) => boolean;
  requireDiet: (status: ReplyValues["status"]) => boolean;
  dietOther: UseFormRegisterReturn;
  /** Other is picked, so its words are asked for. */
  withOther: boolean;
}

/** One person's questions: Festio's age and diet, then the host's own. */
export function PersonFields({ control, index, questions, requireAge, requireDiet, dietOther, withOther }: PersonFieldsProps) {
  const t = useTranslations("GuestList");
  return (
    <>
      <Controller
        control={control}
        name={`people.${index}.ageGroup`}
        rules={{ validate: (value, all) => !requireAge(all.status) || value !== "" || t("ageRequired") }}
        render={({ field, fieldState }) => (
          <SelectField
            label={t("ageLabel")}
            options={AGES.map((age) => ({ value: age, label: t(AGE_KEY[age]) }))}
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <div>
        <Controller
          control={control}
          name={`people.${index}.diet`}
          rules={{
            validate: (value, all) =>
              !requireDiet(all.status) || value.length > 0 || t("dietRequired"),
          }}
          render={({ field, fieldState }) => (
            <MultiSelect
              label={t("dietLabel")}
              placeholder={t("choose")}
              options={DIETS.map((diet) => ({ value: diet, label: t(diet === "none" ? "dietNone" : DIET_KEY[diet]) }))}
              value={field.value}
              onPick={(value) => field.onChange(pickDiet(field.value, value))}
              error={fieldState.error?.message}
            />
          )}
        />
        {withOther ? (
          <input
            {...dietOther}
            maxLength={ANSWER_LIMIT}
            aria-label={t("dietOtherInput")}
            placeholder={t("dietOtherInput")}
            className={`mt-2 ${INPUT}`}
          />
        ) : null}
      </div>
      {questions.map((question) => (
        <QuestionField key={question.id} control={control} name={`people.${index}.answers.${question.id}`} question={question} />
      ))}
    </>
  );
}

interface QuestionFieldProps {
  control: Control<ReplyValues>;
  name: `people.${number}.answers.${string}` | `shared.${string}`;
  question: GuestQuestion;
}

/** A host's question, never required: a choice's empty option, or a yes/no clicked again, goes back to unanswered. */
export function QuestionField({ control, name, question }: QuestionFieldProps) {
  const t = useTranslations("GuestList");
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = typeof field.value === "string" ? field.value : "";
        if (question.kind === "text") {
          return (
            <label className="block min-w-0">
              <span className={`mb-1.5 block ${LABEL}`}>{question.label}</span>
              <input
                ref={field.ref}
                name={field.name}
                value={value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                maxLength={ANSWER_LIMIT}
                className={INPUT}
              />
            </label>
          );
        }
        if (question.kind === "choice") {
          return (
            <SelectField
              label={question.label}
              options={question.options.map((option) => ({ value: option.id, label: option.label }))}
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
            legend={question.label}
            options={options}
            picked={(option) => value === option}
            onPick={(option) => field.onChange(value === option ? "" : option)}
          />
        );
      }}
    />
  );
}
