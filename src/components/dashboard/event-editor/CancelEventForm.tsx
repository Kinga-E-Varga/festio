"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { BTN_DANGER, INPUT } from "@/components/dashboard/event-editor/styles";
import {
  ConfirmPassword,
  useConfirmIdentity,
} from "@/components/dashboard/event-editor/ConfirmPassword";
import { RollOut } from "@/components/dashboard/event-editor/RollOut";
import { ButtonIcon } from "@/components/icons";
import { cancelEvent } from "@/actions/event";
import { CANCEL_MESSAGE_MAX } from "@/db/limits";
import type { HostLogin } from "@/db/reads/host";

interface CancelValues {
  message: string;
  password: string;
}

interface CancelProps {
  eventId: string;
  login: HostLogin;
  /** After the server cancelled it. */
  onCancel: () => void;
  onError: (message: string) => void;
}

/**
 * Cancelling, once asked for: the short message the invitation shows in its
 * place, and the host's password (or Google) to confirm it is them. Cancel
 * event stays off until both are filled. Its row's button opens and closes
 * it (Keep the event).
 */
export function CancelEventForm({
  open,
  ...props
}: CancelProps & { open: boolean }) {
  return (
    <RollOut open={open}>
      <CancelFields {...props} />
    </RollOut>
  );
}

/** The form itself, built afresh each time it opens. */
function CancelFields({ eventId, login, onCancel, onError }: CancelProps) {
  const t = useTranslations("EventEditor");
  const { register, control, handleSubmit } = useForm<CancelValues>({
    defaultValues: { message: "", password: "" },
  });
  const message = useWatch({ control, name: "message" });
  const password = useWatch({ control, name: "password" });
  const identity = useConfirmIdentity(login, onError);
  const ready =
    message.trim().length > 0 &&
    (!login.password || password.length > 0) &&
    !identity.busy;

  async function submit(values: CancelValues) {
    const done = await identity.run(values.password, (idToken) =>
      cancelEvent(eventId, { message: values.message.trim(), idToken }),
    );
    if (done) onCancel();
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cancel-message" className="muted-text">
          {t("cancelMessageLabel")}
        </label>
        <textarea
          id="cancel-message"
          rows={3}
          maxLength={CANCEL_MESSAGE_MAX}
          placeholder={t("cancelMessagePlaceholder")}
          {...register("message", { required: true })}
          className={`${INPUT} resize-y`}
        />
        <p className="hint-text">
          {t("cancelMessageHint", { max: CANCEL_MESSAGE_MAX })}
        </p>
      </div>

      <ConfirmPassword
        id="cancel-password"
        login={login}
        field={register("password", { required: login.password })}
        error={identity.error}
      />

      <div className="flex justify-end">
        <button type="submit" disabled={!ready} className={BTN_DANGER}>
          <ButtonIcon name="ban" />
          {t("cancelButton")}
        </button>
      </div>
    </form>
  );
}
