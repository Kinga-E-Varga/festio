"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { deleteEventNow } from "@/actions/event";
import {
  ConfirmPassword,
  useConfirmIdentity,
} from "@/components/dashboard/event-editor/ConfirmPassword";
import { RollOut } from "@/components/dashboard/event-editor/RollOut";
import { BTN_DANGER } from "@/components/dashboard/event-editor/styles";
import { ButtonIcon } from "@/components/icons";
import type { HostLogin } from "@/db/reads/host";

interface DeleteProps {
  eventId: string;
  login: HostLogin;
  /** After the server deleted the data. */
  onDelete: () => void;
  onError: (message: string) => void;
}

/**
 * Deleting an event's record now, once it has happened or been cancelled: the
 * host's password (or Google) first, so Delete now stays off until it is
 * filled. Its row's button opens and closes it (Keep the data).
 */
export function DeleteRecordForm({
  open,
  ...props
}: DeleteProps & { open: boolean }) {
  return (
    <RollOut open={open}>
      <DeleteFields {...props} />
    </RollOut>
  );
}

/** The form itself, built afresh each time it opens. */
function DeleteFields({ eventId, login, onDelete, onError }: DeleteProps) {
  const t = useTranslations("EventEditor");
  const { register, control, handleSubmit } = useForm<{
    password: string;
  }>({ defaultValues: { password: "" } });
  const password = useWatch({ control, name: "password" });
  const identity = useConfirmIdentity(login, onError);
  const ready = (!login.password || password.length > 0) && !identity.busy;

  async function submit(values: { password: string }) {
    const done = await identity.run(values.password, (idToken) =>
      deleteEventNow(eventId, { idToken }),
    );
    if (done) onDelete();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <ConfirmPassword
        id="delete-password"
        login={login}
        field={register("password", { required: login.password })}
        error={identity.error}
      />
      <div className="flex justify-end">
        <button type="submit" disabled={!ready} className={BTN_DANGER}>
          <ButtonIcon name="trash" />
          {t("deleteNow")}
        </button>
      </div>
    </form>
  );
}
