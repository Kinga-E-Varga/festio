import { useTranslations } from "next-intl";
import { AlertRow } from "@/components/dashboard/AlertRow";
import {
  SMALL_BTN_DANGER,
  SMALL_BTN_DANGER_SOLID,
} from "@/components/dashboard/guest-list/styles";
import { DANGER_ALERT } from "@/components/dashboard/styles";

interface DeleteConfirmProps {
  message: string;
  /** The button that backs out, in the caller's words. */
  keepLabel: string;
  onKeep: () => void;
  onDelete: () => void;
  /** Its space around, where the place it sits needs some. */
  className?: string;
}

/** A delete asks first: the warning prompt in danger's colours, back out (outlined) or delete (solid). */
export function DeleteConfirm({
  message,
  keepLabel,
  onKeep,
  onDelete,
  className = "",
}: DeleteConfirmProps) {
  const t = useTranslations("GuestList");
  return (
    <div role="alert" className={`${className} ${DANGER_ALERT} @container`}>
      <AlertRow title={message}>
        <button type="button" onClick={onKeep} className={SMALL_BTN_DANGER}>
          {keepLabel}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className={SMALL_BTN_DANGER_SOLID}
        >
          {t("delete")}
        </button>
      </AlertRow>
    </div>
  );
}
