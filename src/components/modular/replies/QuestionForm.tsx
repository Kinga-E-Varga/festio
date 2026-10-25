"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { DeleteConfirm } from "@/components/dashboard/guest-list/DeleteConfirm";
import { Icon } from "@/components/icons";
import { Switch } from "@/components/invitation/PanelSwitch";
import {
  BTN_GHOST_LIGHT,
  BTN_PRIMARY,
  CARD_FRAME,
  ERROR,
  ICON_BTN,
  INPUT,
  SOFT_ACTION_SHAPE,
  SOFT_PICK,
  SUBBOX,
  TEXT_LINK,
} from "@/components/dashboard/styles";
import {
  RSVP_OPTION_MAX,
  RSVP_OPTIONS_MAX,
  RSVP_OPTIONS_MIN,
  RSVP_QUESTION_MAX,
} from "@/db/limits";
import {
  questionInputSchema,
  type Question,
  type QuestionInput,
  type QuestionScope,
} from "@/db/schemas/event";
import { newId } from "@/lib/id";
import { FORM_LABEL } from "./styles";

type Kind = Question["kind"];

interface FormValues {
  label: string;
  kind: Kind;
  scope: QuestionScope;
  required: boolean;
  options: { id: string; label: string }[];
}

interface QuestionFormProps {
  /** Where the form starts: a suggestion, a blank question, or the one being edited. */
  start: QuestionInput;
  /** A new question (Add) or one already in the list (Save). */
  isNew: boolean;
  /** Guests have answered it: its type and scope stay, Required can't go on, its options can't go. */
  answered: boolean;
  onSubmit: (question: QuestionInput) => void;
  onCancel: () => void;
  /** Delete (nobody answered, asks first) or Archive (answered); absent for a new question. */
  onRemove?: () => void;
  /** Hangs off its question's bar, sharing the edge, like a Content card's fields. */
  attached?: boolean;
}

const KINDS: Kind[] = ["choice", "yesNo", "text"];
/** Each answer type's and each scope's name, as `RepliesTab` message keys. */
const KIND_KEY = {
  choice: "kindChoice",
  yesNo: "kindYesNo",
  text: "kindText",
} as const;
const SCOPE_KEY = { person: "scopePerson", reply: "scopeReply" } as const;
const SCOPES: QuestionScope[] = ["person", "reply"];

/**
 * One question's form, inline in the Replies tab. Started fresh by its
 * `key` (never `reset()`). Its answer is checked by the same schema the
 * save uses; the first thing wrong is said under the buttons.
 */
export function QuestionForm({
  start,
  isNew,
  answered,
  onSubmit,
  onCancel,
  onRemove,
  attached = false,
}: QuestionFormProps) {
  const t = useTranslations("RepliesTab");
  const startOptions = start.kind === "choice" ? start.options : [];
  const { control, register, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      label: start.label,
      kind: start.kind,
      scope: start.scope,
      required: start.required,
      options: startOptions,
    },
  });
  const options = useFieldArray({ control, name: "options", keyName: "key" });
  const kind = useWatch({ control, name: "kind" });
  const scope = useWatch({ control, name: "scope" });
  const required = useWatch({ control, name: "required" });
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<"label" | "few" | "blank" | null>(null);
  /* An answered choice's options, which guests may have picked: they stay. */
  const kept = new Set(answered ? startOptions.map(({ id }) => id) : []);

  function pickKind(next: Kind) {
    setValue("kind", next);
    if (next === "choice" && getValues("options").length === 0) {
      options.append([
        { id: newId(), label: "" },
        { id: newId(), label: "" },
      ]);
    }
  }

  function submit() {
    const values = getValues();
    const base = {
      id: start.id,
      label: values.label,
      scope: values.scope,
      required: values.required,
      archived: start.archived,
    };
    const parsed = questionInputSchema.safeParse(
      values.kind === "choice"
        ? { ...base, kind: "choice", options: values.options }
        : { ...base, kind: values.kind },
    );
    if (!parsed.success) {
      setError(
        values.label.trim() === ""
          ? "label"
          : values.options.length < RSVP_OPTIONS_MIN
            ? "few"
            : "blank",
      );
      return;
    }
    onSubmit(parsed.data);
  }

  return (
    <div
      className={`flex flex-col gap-4 ${
        attached
          ? `${SUBBOX} rounded-none! border-t-0 border-neutral-400! bg-neutral-50`
          : `${CARD_FRAME} border-neutral-400 p-4`
      }`}
    >
      <div>
        <label htmlFor="question-label" className={FORM_LABEL}>
          {t("question")}
        </label>
        <input
          id="question-label"
          type="text"
          maxLength={RSVP_QUESTION_MAX}
          className={INPUT}
          {...register("label")}
        />
      </div>

      <Choices
        label={t("answer")}
        values={KINDS}
        current={kind}
        name={(each) => t(KIND_KEY[each])}
        locked={answered}
        onPick={pickKind}
      />

      {kind === "choice" ? (
        <fieldset>
          <legend className={FORM_LABEL}>{t("options")}</legend>
          <div className="flex flex-col gap-1.5">
            {options.fields.map((field, index) => (
              <div key={field.key} className="flex items-center gap-1.5">
                <input
                  type="text"
                  maxLength={RSVP_OPTION_MAX}
                  aria-label={t("option", { number: index + 1 })}
                  className={INPUT}
                  {...register(`options.${index}.label`)}
                />
                {kept.has(field.id) ||
                options.fields.length <= RSVP_OPTIONS_MIN ? null : (
                  <button
                    type="button"
                    aria-label={t("removeOption", { number: index + 1 })}
                    onClick={() => options.remove(index)}
                    className={`${ICON_BTN} shrink-0`}
                  >
                    <Icon name="close" className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {options.fields.length < RSVP_OPTIONS_MAX ? (
            <button
              type="button"
              onClick={() => options.append({ id: newId(), label: "" })}
              className={`${TEXT_LINK} mt-2 inline-flex items-center gap-1 hint-face`}
            >
              <Icon name="plus" className="size-3.5" />
              {t("addOption")}
            </button>
          ) : null}
        </fieldset>
      ) : null}

      <Choices
        label={t("ask")}
        values={SCOPES}
        current={scope}
        name={(each) => t(SCOPE_KEY[each])}
        locked={answered}
        onPick={(next) => setValue("scope", next)}
      />

      {answered ? (
        <p className="hint-text text-neutral-700">{t("locked")}</p>
      ) : null}

      {/* Opened off, it stays off; opened on, the switch stays until the form closes. */}
      {answered && !start.required ? (
        <p className="hint-text text-neutral-700">{t("requiredLocked")}</p>
      ) : (
        <div className="flex items-center gap-3">
          <Switch
            label={t("required")}
            checked={required}
            onChange={(on) => setValue("required", on)}
          />
          <span className="button-text text-neutral-700">{t("required")}</span>
        </div>
      )}

      {confirming ? (
        <DeleteConfirm
          message={t("deleteConfirm")}
          keepLabel={t("cancel")}
          onKeep={() => setConfirming(false)}
          onDelete={() => onRemove?.()}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {onRemove ? (
            <button
              type="button"
              onClick={answered ? onRemove : () => setConfirming(true)}
              className={`${TEXT_LINK} mr-auto hint-face`}
            >
              {t(answered ? "archive" : "delete")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onCancel}
            className={`${BTN_GHOST_LIGHT} ml-auto`}
          >
            {t("cancel")}
          </button>
          <button type="button" onClick={submit} className={BTN_PRIMARY}>
            {t(isNew ? "add" : "save")}
          </button>
        </div>
      )}
      {error ? (
        <p role="alert" className={ERROR}>
          {error === "label"
            ? t("labelMissing")
            : error === "few"
              ? t("optionsFew", { min: RSVP_OPTIONS_MIN })
              : t("optionsBlank")}
        </p>
      ) : null}
    </div>
  );
}

/** A row of soft buttons, one picked: the answer type or who it's asked of. Locked, none can be picked. */
function Choices<T extends string>({
  label,
  values,
  current,
  name,
  locked,
  onPick,
}: {
  label: string;
  values: T[];
  current: T;
  name: (value: T) => string;
  locked: boolean;
  onPick: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className={FORM_LABEL}>{label}</legend>
      <div className="flex gap-1.5">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={current === value}
            disabled={locked}
            onClick={() => onPick(value)}
            className={`${SOFT_ACTION_SHAPE} ${SOFT_PICK} flex-1`}
          >
            {name(value)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
