"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  AGE_KEY,
  AGES,
  DIET_KEY,
  DIETS,
} from "@/components/dashboard/guest-list/labels";
import { MultiSelect } from "@/components/dashboard/guest-list/MultiSelect";
import { ANSWER_LIMIT } from "@/components/dashboard/guest-list/replyValues";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { RsvpStatus } from "@/types/invitation";
import { PlusIcon, XIcon } from "./icons";
import {
  ADD_PERSON,
  AGE_DROPDOWN,
  ATTEND_OUTLINE,
  ATTEND_SOLID,
  BOXED_INPUT,
  COUNT_HINT,
  DIET_DROPDOWN,
  PERSON,
  PRIVACY_HINT,
  REPLY_LABEL,
  SOLID,
} from "./styles";
import {
  NAME_LIMIT,
  NOTE_LIMIT,
  type RsvpFormState,
  type RsvpProblem,
} from "./useRsvpForm";

/** Ids only — what each choice is called is the invitation's language. */
const CHOICES: { id: RsvpStatus; key: "going" | "notGoing" }[] = [
  { id: "going", key: "going" },
  { id: "not_going", key: "notGoing" },
];

/** The warning for each problem, in the invitation's language. */
const WARNING_KEY = {
  status: "statusWarning",
  name: "nameWarning",
  age: "ageWarning",
  diet: "dietWarning",
  dietOther: "dietOtherWarning",
} as const satisfies Record<RsvpProblem, string>;

type Row = RsvpFormState["values"]["rows"][number];

interface RsvpFormProps {
  form: RsvpFormState;
  onSubmit: () => void;
}

/**
 * The simple invitation's reply: one going choice for the whole reply, names —
 * each with age and dietary needs when coming — and an optional note.
 * Everything else a template might ask belongs to modular invitations.
 *
 * Nothing warns before the first Send. After it, one line above Send names
 * the first thing still missing, and follows the form as it is fixed.
 *
 * Every word here is Festio's, not the host's, so it comes from the catalog
 * of the invitation's own `language` — the provider around this tree, never
 * the locale the host happens to read the dashboard in.
 */
export function RsvpForm({ form, onSubmit }: RsvpFormProps) {
  const t = useTranslations("Rsvp");
  const { values, set, derived } = form;
  const [attempted, setAttempted] = useState(false);
  const warning = attempted && derived.problem ? derived.problem : null;
  /* Anyone can be taken off the reply, as long as one name is left. */
  const removable = values.rows.length > 1;

  return (
    <form
      className="flex flex-col gap-10 max-w-[520px] m-auto"
      onSubmit={(control) => {
        control.preventDefault();
        setAttempted(true);
        if (derived.problem) return;
        onSubmit();
      }}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className={`${REPLY_LABEL} mb-3`}>{t("attendance")}</legend>
        <div className="flex gap-3">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              aria-pressed={values.status === choice.id}
              onClick={() => set.status(choice.id)}
              className={
                values.status === choice.id ? ATTEND_SOLID : ATTEND_OUTLINE
              }
            >
              {t(choice.key)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset aria-label={t("whoIsComing")} className="flex flex-col gap-10">
        {values.rows.map((row, index) => (
          <div key={row.id} className={PERSON}>
            <div className="flex flex-col gap-2">
              <label htmlFor={`name-${row.id}`} className={REPLY_LABEL}>
                {t("name")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`name-${row.id}`}
                  type="text"
                  value={row.value}
                  maxLength={NAME_LIMIT}
                  placeholder={t("fullName")}
                  aria-label={t("nameNumber", { number: index + 1 })}
                  onChange={(control) => set.name(row.id, control.target.value)}
                  className={BOXED_INPUT}
                />
                {removable ? (
                  <button
                    type="button"
                    aria-label={t("removeName", { number: index + 1 })}
                    onClick={() => set.removeName(row.id)}
                    className="text-[color:var(--c4)] transition-colors hover:text-[color:var(--c3)]"
                  >
                    <XIcon size={14} />
                  </button>
                ) : null}
              </div>
            </div>
            {derived.going ? (
              <PersonQuestions form={form} row={row} removable={removable} />
            ) : null}
          </div>
        ))}

        <button
          type="button"
          onClick={set.addName}
          className={`${ADD_PERSON} self-start`}
        >
          <PlusIcon size={14} />
          {t("addPerson")}
        </button>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="rsvp-note" className={REPLY_LABEL}>
          {t("noteLabel")}
        </label>
        <textarea
          id="rsvp-note"
          rows={3}
          value={values.note}
          maxLength={NOTE_LIMIT}
          placeholder={t("notePlaceholder")}
          onChange={(control) => set.note(control.target.value)}
          className={`${BOXED_INPUT} resize-none`}
        />
        <p className={COUNT_HINT}>
          {t("charactersLeft", { count: derived.noteLeft })}
        </p>
      </div>

      <div className="-mt-5 flex flex-col gap-3">
        {warning ? (
          <p className="text-[12px] text-center leading-[1.45] text-[color:var(--c6)]">
            {t(WARNING_KEY[warning])}
          </p>
        ) : null}

        <button type="submit" className={SOLID}>
          {t("submit")}
        </button>

        <p className={PRIVACY_HINT}>
          {t("privacy", { days: GUEST_DATA_RETENTION_DAYS })}
        </p>
      </div>
    </form>
  );
}

/** Age and dietary needs, asked of each person when the reply is Coming. */
function PersonQuestions({
  form,
  row,
  removable,
}: {
  form: RsvpFormState;
  row: Row;
  /** The name has an × beside it; the answers stop short of it, where the name does — its 14px plus the 12px gap. */
  removable: boolean;
}) {
  const t = useTranslations("Rsvp");
  const { set } = form;

  return (
    <div className={`flex flex-col gap-4 pl-8 ${removable ? "pr-[26px]" : ""}`}>
      <MultiSelect
        label={t("ageLabel")}
        placeholder={t("choose")}
        options={AGES.map((age) => ({ value: age, label: t(AGE_KEY[age]) }))}
        value={row.ageGroup === "" ? [] : [row.ageGroup]}
        onPick={(age) => set.age(row.id, age)}
        skin={AGE_DROPDOWN}
        single
      />

      <div>
        <MultiSelect
          label={t("dietLabel")}
          placeholder={t("choose")}
          options={DIETS.map((diet) => ({
            value: diet,
            label: t(diet === "none" ? "dietNone" : DIET_KEY[diet]),
          }))}
          value={row.diet}
          onPick={(diet) => set.diet(row.id, diet)}
          skin={DIET_DROPDOWN}
        />
        {row.diet.includes("other") ? (
          <input
            type="text"
            value={row.dietOther}
            maxLength={ANSWER_LIMIT}
            placeholder={t("dietOtherInput")}
            aria-label={t("dietOtherInput")}
            onChange={(control) => set.dietOther(row.id, control.target.value)}
            className={`mt-2 ${BOXED_INPUT}`}
          />
        ) : null}
      </div>
    </div>
  );
}
