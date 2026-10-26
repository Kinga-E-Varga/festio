"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { DeleteConfirm } from "@/components/dashboard/guest-list/DeleteConfirm";
import {
  NameField,
  PersonFields,
  QuestionField,
  StatusField,
} from "@/components/dashboard/guest-list/ReplyFields";
import {
  RowEditor,
  type RowEditorProps,
} from "@/components/dashboard/guest-list/RowEditor";
import {
  newReplyValues,
  personQuestions,
  personValues,
  replyValues,
  sharedQuestions,
} from "@/components/dashboard/guest-list/replyValues";
import {
  ICON_BTN_EDITOR,
  SMALL_BTN,
  SMALL_BTN_DANGER_SOLID,
} from "@/components/dashboard/guest-list/styles";
import { ButtonIcon, Icon } from "@/components/icons";
import { RSVP_NAME_MAX } from "@/db/limits";
import type { GuestQuestion, GuestReply, ReplyValues } from "@/types/guests";

interface ReplyEditorProps extends RowEditorProps {
  /** A saved reply's people, in the guest's order; empty for a new reply. */
  group: GuestReply[];
  questions: GuestQuestion[];
  /** Whose edit opened it: their name gets the focus. */
  start?: number;
  /** Resolves once saved; the form waits for it. */
  onSave: (values: ReplyValues) => Promise<unknown>;
  /** A saved reply only: deletes it, everyone in it. */
  onDelete?: () => Promise<unknown>;
}

/** One question under another, each label above its field. */
const QUESTIONS = "flex flex-col gap-4";

/**
 * A whole reply as the RSVP form asks it, minus the message: one status,
 * each person, then the reply-wide questions. New and saved replies alike;
 * a saved one can gain people but not lose them (they're separated first).
 */
export function ReplyEditor({
  group,
  questions,
  start = 0,
  onSave,
  onDelete,
  onCancel,
  onDirty,
  pending,
}: ReplyEditorProps) {
  const t = useTranslations("GuestList");
  const { register, handleSubmit, setFocus, formState, control } =
    useForm<ReplyValues>({
      defaultValues:
        group.length > 0
          ? replyValues(group, questions)
          : newReplyValues(questions),
    });
  const { fields, append, remove } = useFieldArray({ control, name: "people" });
  const people = useWatch({ control, name: "people" });
  const status = useWatch({ control, name: "status" });
  const { isDirty, errors, isSubmitting } = formState;
  const going = status === "going";
  const own = personQuestions(questions);
  const shared = sharedQuestions(questions);

  /* Centred, so the picked person shows with what's around them, clear of the pinned buttons. */
  useEffect(() => {
    setFocus(`people.${start}.name`);
    document.activeElement?.scrollIntoView({ block: "center" });
  }, [setFocus, start]);
  useEffect(() => onDirty(isDirty), [onDirty, isDirty]);

  /** One person: their name, then their questions when coming, set in a little under it. */
  function person(index: number) {
    const values = people[index];
    return (
      <>
        <NameField
          registration={register(`people.${index}.name`, {
            validate: (value) => value.trim() !== "" || t("nameRequired"),
            maxLength: RSVP_NAME_MAX,
          })}
          error={errors.people?.[index]?.name?.message}
        />
        {going ? (
          <div className={`${QUESTIONS} pl-4`}>
            <PersonFields
              control={control}
              index={index}
              questions={own}
              register={register}
              values={values}
              errors={errors.people}
            />
          </div>
        ) : null}
      </>
    );
  }

  const withShared = going && shared.length > 0;

  return (
    <RowEditor
      onSubmit={handleSubmit(onSave)}
      onCancel={onCancel}
      pending={pending}
      saving={isSubmitting}
      inDialog
    >
      <StatusField control={control} />
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-3 border-t border-neutral-200 pt-4"
        >
          {/* Only someone added in this form can be taken out again. */}
          {index >= group.length && fields.length > 1 ? (
            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {person(index)}
              </div>
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
      <div
        className={`border-t border-neutral-200 pt-4 ${withShared ? "border-b pb-4" : ""}`}
      >
        <button
          type="button"
          onClick={() => append(personValues(null, questions))}
          className={SMALL_BTN}
        >
          <ButtonIcon name="plus" />
          {t("addPerson")}
        </button>
      </div>
      {withShared ? (
        <div className={QUESTIONS}>
          {shared.map((question) => (
            <QuestionField
              key={question.id}
              control={control}
              name={`shared.${question.id}`}
              question={question}
            />
          ))}
        </div>
      ) : null}
      {onDelete ? (
        <DeleteReply
          names={group.map((reply) => reply.name)}
          onDelete={onDelete}
        />
      ) : null}
    </RowEditor>
  );
}

interface DeleteReplyProps {
  names: string[];
  onDelete: () => Promise<unknown>;
}

/** The whole reply at once, under a line at the form's end; asks first, naming everyone. */
function DeleteReply({ names, onDelete }: DeleteReplyProps) {
  const t = useTranslations("GuestList");
  const locale = useLocale();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="border-t border-neutral-200 pt-4">
      {confirming ? (
        <DeleteConfirm
          message={t("deleteReplyConfirm", {
            names: new Intl.ListFormat(locale).format(names),
          })}
          /* Not "Cancel": the form's own Cancel sits right below. */
          keepLabel={t("keepReply")}
          onKeep={() => setConfirming(false)}
          onDelete={onDelete}
        />
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className={SMALL_BTN_DANGER_SOLID}
        >
          <ButtonIcon name="trash" />
          {t(names.length > 1 ? "deleteGroupReply" : "deleteReply")}
        </button>
      )}
    </div>
  );
}
