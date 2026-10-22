"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { BTN_DANGER, INPUT } from "@/components/dashboard/event-editor/styles";
import { ConfirmPassword } from "@/components/dashboard/event-editor/ConfirmPassword";
import { RollOut } from "@/components/dashboard/event-editor/RollOut";
import { ButtonIcon } from "@/components/icons";

/** The longest message the cancelled invitation shows. */
export const CANCEL_MESSAGE_MAX = 300;

interface CancelValues {
  message: string;
  password: string;
}

/**
 * Cancelling, once asked for: the short message the invitation shows in its
 * place, and the host's password to confirm it is them. Cancel event stays
 * off until both are filled. Its row's button opens and closes it (Keep the
 * event).
 */
export function CancelEventForm({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: (message: string) => void;
}) {
  return (
    <RollOut open={open}>
      <CancelFields onCancel={onCancel} />
    </RollOut>
  );
}

/** The form itself, built afresh each time it opens. */
function CancelFields({ onCancel }: { onCancel: (message: string) => void }) {
  const t = useTranslations("EventEditor");
  const { register, control, handleSubmit } = useForm<CancelValues>({
    defaultValues: { message: "", password: "" },
  });
  const message = useWatch({ control, name: "message" });
  const password = useWatch({ control, name: "password" });
  const ready = message.trim().length > 0 && password.length > 0;

  return (
    <form
      onSubmit={handleSubmit((values) => onCancel(values.message.trim()))}
      className="flex flex-col gap-4"
    >
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
        field={register("password", { required: true })}
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
