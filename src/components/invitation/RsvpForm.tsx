"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import {
  MultiSelect,
  type MultiSelectSkin,
} from "@/components/dashboard/guest-list/MultiSelect";
import { GUEST_DATA_RETENTION_DAYS } from "@/lib/config";
import type { Question } from "@/db/schemas/event";
import type { NeedsPick } from "@/types/guests";
import type { RsvpStatus } from "@/types/invitation";
import { PlusIcon, XIcon } from "./icons";
import { RsvpQuestion } from "./RsvpQuestion";
import { INVITE_SCROLL, PERSON } from "./styles";
import { RSVP_ANSWER_MAX, RSVP_NAME_MAX, RSVP_NOTE_MAX } from "@/db/limits";
import type { RsvpFormState, RsvpProblem } from "./useRsvpForm";

/** Ids only — what each choice is called is the invitation's language. */
const CHOICES: { id: RsvpStatus; key: "going" | "notGoing" }[] = [
  { id: "going", key: "going" },
  { id: "not_going", key: "notGoing" },
];

/** The warning for each problem, in the invitation's language. */
const WARNING_KEY = {
  status: "statusWarning",
  name: "nameWarning",
  needsOther: "otherWarning",
  question: "questionWarning",
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
  /** Names, the Other box and the note. */
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
  needs: MultiSelectSkin;
}

/** Why the last Send didn't go through, as an `Rsvp` message key. */
export type RsvpFailure = "tooMany" | "tryAgain";

interface RsvpFormProps {
  form: RsvpFormState;
  skin: RsvpSkin;
  onSubmit: () => void;
  /** The reply is on its way: Send waits, so a second tap sends nothing. */
  sending?: boolean;
  failure?: RsvpFailure | null;
}

/**
 * The reply, for simple and modular invitations alike: one going choice for
 * the whole reply, names — each with the host's person questions when coming — and
 * an optional note. The layout is fixed; how each part looks is the `skin`'s.
 *
 * Nothing warns before the first Send. After it, one line above Send names
 * the first thing still missing, and follows the form as it is fixed.
 *
 * Every word here is Festio's, not the host's, so it comes from the catalog
 * of the invitation's own `language` — the provider around this tree, never
 * the locale the host happens to read the dashboard in.
 */
export function RsvpForm({
  form,
  skin,
  onSubmit,
  sending = false,
  failure = null,
}: RsvpFormProps) {
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
        if (derived.problem || sending) return;
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
                  maxLength={RSVP_NAME_MAX}
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
                id={`${formId}-person-${index}`}
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

      {derived.going && form.questions.shared.length > 0 ? (
        <div className={`flex flex-col ${skin.space.group}`}>
          {form.questions.shared.map((question) => (
            <RsvpQuestion
              key={question.id}
              id={`${formId}-shared-${question.id}`}
              question={question}
              value={values.shared[question.id]}
              onChange={(value) => set.sharedAnswer(question.id, value)}
              skin={skin}
            />
          ))}
        </div>
      ) : null}

      <div className={`flex flex-col ${skin.space.field}`}>
        <label htmlFor="rsvp-note" className={skin.label}>
          {t("noteLabel")}
        </label>
        <textarea
          id="rsvp-note"
          rows={3}
          value={values.note}
          maxLength={RSVP_NOTE_MAX}
          placeholder={t("notePlaceholder")}
          onChange={(control) => set.note(control.target.value)}
          className={`${skin.input} resize-none ${INVITE_SCROLL}`}
        />
      </div>

      <div className={`${skin.space.send} flex flex-col gap-3`}>
        {warning ? (
          <p className={skin.warning}>{t(WARNING_KEY[warning])}</p>
        ) : failure ? (
          <p role="alert" className={skin.warning}>
            {t(failure)}
          </p>
        ) : null}

        <button type="submit" disabled={sending} className={skin.submit}>
          {t(sending ? "sending" : "submit")}
        </button>

        <p className={skin.privacy}>
          {t("privacy", { days: GUEST_DATA_RETENTION_DAYS })}
        </p>
      </div>
    </form>
  );
}

/** The host's per-person questions, in their order, asked of each person when the reply is Coming. */
function PersonQuestions({
  form,
  skin,
  row,
  removable,
  id,
}: {
  form: RsvpFormState;
  skin: RsvpSkin;
  row: Row;
  /** The name has an × beside it; the answers stop short of it, where the name does — its 14px plus the 12px gap. */
  removable: boolean;
  /** The start of this person's field ids. */
  id: string;
}) {
  const { set } = form;

  return (
    <div className={`flex flex-col gap-4 pl-8 ${removable ? "pr-[26px]" : ""}`}>
      {form.questions.person.map((question) =>
        question.kind === "needs" ? (
          <NeedsQuestion
            key={question.id}
            question={question}
            form={form}
            skin={skin}
            row={row}
          />
        ) : (
          <RsvpQuestion
            key={question.id}
            id={`${id}-${question.id}`}
            question={question}
            value={row.answers[question.id]}
            onChange={(value) => set.answer(row.id, question.id, value)}
            skin={skin}
          />
        ),
      )}
    </div>
  );
}

/** A needs question: None and the options as ticks, with a box for Other's own words. */
function NeedsQuestion({
  question,
  form,
  skin,
  row,
}: {
  question: Extract<Question, { kind: "needs" }>;
  form: RsvpFormState;
  skin: RsvpSkin;
  row: Row;
}) {
  const t = useTranslations("Rsvp");
  const { set } = form;
  const picked = row.needs[question.id];
  const options: { value: NeedsPick; label: string }[] = [
    { value: "none", label: t("needsNone") },
    ...question.options.map((option) => ({
      value: option.id,
      label: option.label,
    })),
  ];

  return (
    <div>
      <MultiSelect
        label={question.label}
        placeholder={t("choose")}
        options={options}
        value={picked?.picks ?? []}
        onPick={(pick) => set.needs(row.id, question.id, pick)}
        skin={skin.needs}
      />
      {picked?.picks.includes("other") ? (
        <input
          type="text"
          value={picked.other}
          maxLength={RSVP_ANSWER_MAX}
          placeholder={t("otherInput")}
          aria-label={t("otherInput")}
          onChange={(control) =>
            set.needsOther(row.id, question.id, control.target.value)
          }
          className={`mt-2 ${skin.input}`}
        />
      ) : null}
    </div>
  );
}
