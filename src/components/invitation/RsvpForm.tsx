"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import {
  AGE_KEY,
  AGES,
  DIET_KEY,
  DIETS,
} from "@/components/dashboard/guest-list/labels";
import {
  MultiSelect,
  type MultiSelectSkin,
} from "@/components/dashboard/guest-list/MultiSelect";
import { ANSWER_LIMIT } from "@/components/dashboard/guest-list/replyValues";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { RsvpStatus } from "@/types/invitation";
import { PlusIcon, XIcon } from "./icons";
import { PERSON } from "./styles";
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

/**
 * How the reply form looks, part by part. The layout is the form's and the
 * same everywhere; every class here is the invitation's — a simple
 * invitation's in `--c*`, each modular RSVP variant its own in `--m-*`.
 * Every part is required, so a new part can't be forgotten by a skin.
 */
export interface RsvpSkin {
  /** Field labels and the attendance legend. */
  label: string;
  /** Names, the Other diet box and the note. */
  input: string;
  /** Coming / Not coming. */
  choice: { picked: string; unpicked: string };
  /** The × beside a name. */
  remove: string;
  addPerson: string;
  submit: string;
  /** The privacy notice under Send. */
  privacy: string;
  /** The one warning above Send. */
  warning: string;
  /**
   * The form's spacing: `group` between its groups (and between the names
   * and Add person), `field` from a label to its input and its hint,
   * `legend` under the attendance legend, `send` on top of the Send block.
   */
  space: { group: string; field: string; legend: string; send: string };
  age: MultiSelectSkin;
  diet: MultiSelectSkin;
}

interface RsvpFormProps {
  form: RsvpFormState;
  skin: RsvpSkin;
  onSubmit: () => void;
}

/**
 * The reply, for simple and modular invitations alike: one going choice for
 * the whole reply, names — each with age and dietary needs when coming — and
 * an optional note. The layout is fixed; how each part looks is the `skin`'s.
 *
 * Nothing warns before the first Send. After it, one line above Send names
 * the first thing still missing, and follows the form as it is fixed.
 *
 * Every word here is Festio's, not the host's, so it comes from the catalog
 * of the invitation's own `language` — the provider around this tree, never
 * the locale the host happens to read the dashboard in.
 */
export function RsvpForm({ form, skin, onSubmit }: RsvpFormProps) {
  const t = useTranslations("Rsvp");
  /*
   * Element ids come from `useId` and the row's place, never the row's own
   * id: React Hook Form makes that one up at random, so the server's and the
   * browser's would differ and the page would fail to hydrate cleanly.
   */
  const formId = useId();
  const { values, set, derived } = form;
  const [attempted, setAttempted] = useState(false);
  const warning = attempted && derived.problem ? derived.problem : null;
  /* Anyone can be taken off the reply, as long as one name is left. */
  const removable = values.rows.length > 1;

  return (
    <form
      className={`flex flex-col ${skin.space.group} max-w-[520px] m-auto`}
      onSubmit={(control) => {
        control.preventDefault();
        setAttempted(true);
        if (derived.problem) return;
        onSubmit();
      }}
    >
      <fieldset className="flex flex-col gap-3">
        <legend className={`${skin.label} ${skin.space.legend}`}>
          {t("attendance")}
        </legend>
        <div className="flex gap-3">
          {CHOICES.map((choice) => (
            <button
              key={choice.id}
              type="button"
              aria-pressed={values.status === choice.id}
              onClick={() => set.status(choice.id)}
              className={
                values.status === choice.id
                  ? skin.choice.picked
                  : skin.choice.unpicked
              }
            >
              {t(choice.key)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset
        aria-label={t("whoIsComing")}
        className={`flex flex-col ${skin.space.group}`}
      >
        {values.rows.map((row, index) => (
          <div key={row.id} className={PERSON}>
            <div className={`flex flex-col ${skin.space.field}`}>
              <label htmlFor={`${formId}-name-${index}`} className={skin.label}>
                {t("name")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`${formId}-name-${index}`}
                  type="text"
                  value={row.value}
                  maxLength={NAME_LIMIT}
                  placeholder={t("fullName")}
                  aria-label={t("nameNumber", { number: index + 1 })}
                  onChange={(control) => set.name(row.id, control.target.value)}
                  className={skin.input}
                />
                {removable ? (
                  <button
                    type="button"
                    aria-label={t("removeName", { number: index + 1 })}
                    onClick={() => set.removeName(row.id)}
                    className={skin.remove}
                  >
                    <XIcon size={14} />
                  </button>
                ) : null}
              </div>
            </div>
            {derived.going ? (
              <PersonQuestions
                form={form}
                skin={skin}
                row={row}
                removable={removable}
              />
            ) : null}
          </div>
        ))}

        <button
          type="button"
          onClick={set.addName}
          className={`${skin.addPerson} self-start`}
        >
          <PlusIcon size={14} />
          {t("addPerson")}
        </button>
      </fieldset>

      <div className={`flex flex-col ${skin.space.field}`}>
        <label htmlFor="rsvp-note" className={skin.label}>
          {t("noteLabel")}
        </label>
        <textarea
          id="rsvp-note"
          rows={3}
          value={values.note}
          maxLength={NOTE_LIMIT}
          placeholder={t("notePlaceholder")}
          onChange={(control) => set.note(control.target.value)}
          className={`${skin.input} resize-none`}
        />
      </div>

      <div className={`${skin.space.send} flex flex-col gap-3`}>
        {warning ? (
          <p className={skin.warning}>{t(WARNING_KEY[warning])}</p>
        ) : null}

        <button type="submit" className={skin.submit}>
          {t("submit")}
        </button>

        <p className={skin.privacy}>
          {t("privacy", { days: GUEST_DATA_RETENTION_DAYS })}
        </p>
      </div>
    </form>
  );
}

/** Age and dietary needs, asked of each person when the reply is Coming. */
function PersonQuestions({
  form,
  skin,
  row,
  removable,
}: {
  form: RsvpFormState;
  skin: RsvpSkin;
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
        skin={skin.age}
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
          skin={skin.diet}
        />
        {row.diet.includes("other") ? (
          <input
            type="text"
            value={row.dietOther}
            maxLength={ANSWER_LIMIT}
            placeholder={t("dietOtherInput")}
            aria-label={t("dietOtherInput")}
            onChange={(control) => set.dietOther(row.id, control.target.value)}
            className={`mt-2 ${skin.input}`}
          />
        ) : null}
      </div>
    </div>
  );
}
