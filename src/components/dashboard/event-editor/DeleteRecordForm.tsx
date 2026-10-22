"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { ConfirmPassword } from "@/components/dashboard/event-editor/ConfirmPassword";
import { RollOut } from "@/components/dashboard/event-editor/RollOut";
import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { ButtonIcon } from "@/components/icons";

/**
 * Deleting an event's record now, once it has happened or been cancelled: the host's password
 * first, so Delete now stays off until it is filled. Its row's button opens
 * and closes it (Keep the data).
 */
export function DeleteRecordForm({
  open,
  onDelete,
}: {
  open: boolean;
  onDelete: () => void;
}) {
  return (
    <RollOut open={open}>
      <DeleteFields onDelete={onDelete} />
    </RollOut>
  );
}

/** The form itself, built afresh each time it opens. */
function DeleteFields({ onDelete }: { onDelete: () => void }) {
  const t = useTranslations("EventEditor");
  const { register, control, handleSubmit } = useForm<{
    password: string;
  }>({ defaultValues: { password: "" } });
  const password = useWatch({ control, name: "password" });

  return (
    <form onSubmit={handleSubmit(onDelete)} className="flex flex-col gap-4">
      <ConfirmPassword
        id="delete-password"
        field={register("password", { required: true })}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={password.length === 0}
          className={BTN_DANGER}
        >
          <ButtonIcon name="trash" />
          {t("deleteNow")}
        </button>
      </div>
    </form>
  );
}
