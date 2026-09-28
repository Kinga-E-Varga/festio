"use client";

import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { HINT } from "@/components/dashboard/event-editor/styles";
import { NameField, PersonFields, QuestionField, StatusField } from "@/components/dashboard/guest-list/ReplyFields";
import { RowEditor, type RowEditorProps } from "@/components/dashboard/guest-list/RowEditor";
import {
  newReplyValues,
  personQuestions,
  personValues,
  replyValues,
  sharedQuestions,
} from "@/components/dashboard/guest-list/replyValues";
import {
  ALERT,
  ICON_BTN_EDITOR,
  SMALL_BTN_EDITOR,
  SMALL_BTN_WARN,
  SMALL_BTN_WARN_SOLID,
} from "@/components/dashboard/guest-list/styles";
import { Icon } from "@/components/icons";
import { NAME_LIMIT } from "@/components/invitation/useRsvpForm";
import type { GuestQuestion, GuestReply, ReplyValues } from "@/types/guests";

interface ReplyEditorProps extends RowEditorProps {
  /** Null for a new reply. */
  reply: GuestReply | null;
  questions: GuestQuestion[];
  /** The others in this person's reply: a reply-wide answer changes for them too. */
  party: string[];
  onSave: (values: ReplyValues) => void;
}

/** One question under another, each label above its field. */
const QUESTIONS = "flex flex-col gap-4";

/**
 * A reply as the RSVP form asks it, minus the message. An existing reply is
 * one person; a new one can hold several, with one status for them all.
 */
export function ReplyEditor({ reply, questions, party, onSave, onCancel, onDirty, pending }: ReplyEditorProps) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  const { register, handleSubmit, setFocus, setValue, formState, control } = useForm<ReplyValues>({
    defaultValues: reply ? replyValues(reply, questions) : newReplyValues(questions),
  });
  const { fields, append, remove } = useFieldArray({ control, name: "people" });
  const people = useWatch({ control, name: "people" });
  const status = useWatch({ control, name: "status" });
  const separate = useWatch({ control, name: "separate" });
  const partyList = new Intl.ListFormat(locale).format(party);
  const { isDirty, errors } = formState;
  const going = status === "going";
  const own = personQuestions(questions);
  const shared = sharedQuestions(questions);

  useEffect(() => setFocus("people.0.name"), [setFocus]);
  useEffect(() => onDirty(isDirty), [onDirty, isDirty]);

  /*
   * Festio always asks age and diet, so they're required wherever the person
   * is asked: a new reply, someone switched to Coming, or an answer already
   * there. A reply that was never asked them isn't held to them.
   */
  const required = (field: "ageGroup" | "diet") => (next: ReplyValues["status"]) =>
    next === "going" && (reply === null || reply.status !== "going" || (reply[field] !== undefined && reply[field] !== null));

  /** One person: their name (and whatever goes under it), then their questions when coming — under a line when editing, set in a little under their name in a new reply. */
  function person(index: number, below?: ReactNode) {
    const values = people[index];
    return (
      <>
        <div className="flex flex-col gap-4">
          <NameField
            registration={register(`people.${index}.name`, {
              validate: (value) => value.trim() !== "" || t("nameRequired"),
              maxLength: NAME_LIMIT,
            })}
            error={errors.people?.[index]?.name?.message}
          />
          {below}
        </div>
        {going ? (
          <div className={`${QUESTIONS} ${reply ? "border-t border-mustard-300 pt-4" : "pl-4"}`}>
            <PersonFields
              control={control}
              index={index}
              questions={own}
              requireAge={required("ageGroup")}
              requireDiet={required("diet")}
              dietOther={register(`people.${index}.dietOther`)}
              withOther={values?.diet.includes("other") ?? false}
            />
          </div>
        ) : null}
      </>
    );
  }

  /* Editing someone who replied with others: the reply-wide questions get the hint and Separate. */
  const grouped = party.length > 0;
  const withShared = going && shared.length > 0;
  const separateField =
    reply && party.length > 0 ? (
      <SeparateField
        name={reply.name}
        party={partyList}
        separate={separate}
        onSeparate={() => setValue("separate", true, { shouldDirty: true })}
      />
    ) : null;
  const sharedFields = (
    <div className={QUESTIONS}>
      {shared.map((question) => (
        <QuestionField key={question.id} control={control} name={`shared.${question.id}`} question={question} />
      ))}
    </div>
  );
  /*
   * Editing someone in a group: the hint and the way out of the group
   * (Separate) sit between two lines, 16px from each, above the reply-wide
   * questions. Once Separate is picked the hint no longer holds. A new reply
   * has its questions straight under Add person.
   */
  const sharedBlock = withShared ? (
    grouped ? (
      <div className="flex flex-col gap-4 border-t border-mustard-300 pt-4">
        <div className="flex flex-col gap-3 border-b border-mustard-300 pb-4">
          {separate ? null : <p className={`text-justify ${HINT}`}>{t("sharedFor", { names: partyList })}</p>}
          {separateField}
        </div>
        {sharedFields}
      </div>
    ) : (
      sharedFields
    )
  ) : null;

  const submit = handleSubmit(onSave);

  if (reply) {
    return (
      <RowEditor onSubmit={submit} onCancel={onCancel} pending={pending}>
        {/* No reply-wide part to sit in (not coming, or no such questions): Separate stays under the name. */}
        {person(
          0,
          <>
            {withShared ? null : separateField}
            <StatusField control={control} />
          </>,
        )}
        {sharedBlock}
      </RowEditor>
    );
  }

  return (
    <RowEditor onSubmit={submit} onCancel={onCancel} pending={pending}>
      <StatusField control={control} />
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col gap-3 border-t border-mustard-300 pt-4">
          {fields.length > 1 ? (
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-3">{person(index)}</div>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={t("removePerson", { number: index + 1 })}
                className={`mt-[22px] ${ICON_BTN_EDITOR}`}
              >
                <Icon name="close" className="size-4" />
              </button>
            </div>
          ) : (
            person(index)
          )}
        </div>
      ))}
      {/* Between lines: the one below is the buttons' own unless reply-wide questions come first. */}
      <div className={`border-t border-mustard-300 pt-4 ${withShared ? "border-b pb-4" : ""}`}>
        <button type="button" onClick={() => append(personValues(null, questions))} className={SMALL_BTN_EDITOR}>
          <Icon name="plus" className="size-3.5" />
          {t("addPerson")}
        </button>
      </div>
      {withShared ? sharedFields : null}
    </RowEditor>
  );
}

interface SeparateFieldProps {
  name: string;
  /** The others in the reply, as one list. */
  party: string;
  separate: boolean;
  onSeparate: () => void;
}

/** Asks first, since it can't be undone once saved; until Save, Cancel still keeps them together. */
function SeparateField({ name, party, separate, onSeparate }: SeparateFieldProps) {
  const t = useTranslations("GuestList");
  const [confirming, setConfirming] = useState(false);

  if (separate) return <p className={HINT}>{t("separatePending", { name })}</p>;
  if (confirming) {
    return (
      <div role="alert" className={`${ALERT} flex flex-wrap items-center gap-2.5`}>
        <span className="mr-auto">{t("separateConfirm", { name, names: party })}</span>
        <div className="flex shrink-0 gap-2.5">
          <button type="button" onClick={() => setConfirming(false)} className={SMALL_BTN_WARN}>
            {t("keepTogether")}
          </button>
          <button type="button" onClick={onSeparate} className={SMALL_BTN_WARN_SOLID}>
            {t("separateOk")}
          </button>
        </div>
      </div>
    );
  }
  return (
    <button type="button" onClick={() => setConfirming(true)} className={`self-start ${SMALL_BTN_EDITOR}`}>
      {t("separateButton")}
    </button>
  );
}
