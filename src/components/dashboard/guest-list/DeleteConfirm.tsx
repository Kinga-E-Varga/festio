import { useTranslations } from "next-intl";
import {
  GUEST_BTN_DANGER,
  GUEST_BTN_DANGER_OUTLINE,
} from "@/components/dashboard/guest-list/styles";

interface DeleteConfirmProps {
  message: string;
  /** The button that backs out, in the caller's words. */
  keepLabel: string;
  onKeep: () => void;
  onDelete: () => void;
  /** The buttons under the message, not beside it. */
  stacked?: boolean;
}

/** A delete asks first: the question in danger's colour, back out (outlined) or delete (solid). */
export function DeleteConfirm({
  message,
  keepLabel,
  onKeep,
  onDelete,
  stacked = false,
}: DeleteConfirmProps) {
  const t = useTranslations("GuestList");
  return (
    <div
      role="alert"
      className={`flex gap-2.5 meta-face text-danger-800 ${
        stacked ? "flex-col" : "flex-wrap items-center pb-2"
      }`}
    >
      <span className={stacked ? undefined : "mr-auto"}>{message}</span>
      <div className="flex shrink-0 gap-2.5">
        <button
          type="button"
          onClick={onKeep}
          className={GUEST_BTN_DANGER_OUTLINE}
        >
          {keepLabel}
        </button>
        <button type="button" onClick={onDelete} className={GUEST_BTN_DANGER}>
          {t("delete")}
        </button>
      </div>
    </div>
  );
}
